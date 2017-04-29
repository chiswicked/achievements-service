const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const server = require('../../src/utils/server-connection');

const should = chai.should();

chai.use(chaiAsPromised);

describe('HTTP Server', () => {
  it('should not have a connection before connecting', () => {
    should.not.exist(server.connection());
  });

  it('should return error message if connected with invalid Express app', () => {
    const invalidExpressApp = {
      listen: (port, callback) => {
        callback(new Error('Express App failed to start up'));
      },
    };
    return server.connect(invalidExpressApp, 8888).should.be.rejectedWith('Express App failed to start up');
  });

  it('should return connection if connected with valid Express app', () => {
    const validExpressApp = {
      listen: (port, callback) => {
        callback(undefined, {});
      },
    };
    return server.connect(validExpressApp, 8888).should.be.fulfilled;
  });

  it('should return connection after successfully connecting', () => {
    const validExpressApp = {
      listen: (port, callback) => {
        callback(undefined, { fake: 'server' });
      },
    };
    return server.connect(validExpressApp, 8888).should.eventually.deep.equal(validExpressApp);
  });

  it('should set connection after successfully connecting', (done) => {
    const validExpressApp = {
      listen: (port, callback) => {
        callback(undefined, {});
      },
    };
    server.connect(validExpressApp, 8888).then(() => {
      server.connection().should.deep.equal(validExpressApp);
      done();
    });
  });

  it('should clear cache after disconnecting', (done) => {
    const close = sinon.spy();
    const validExpressApp = {
      close,
      listen: (port, callback) => {
        callback(undefined, {});
      },
    };
    server.connect(validExpressApp, 8888).then(() => {
      server.disconnect();
      close.should.have.been.calledOnce;
      done();
    });
  });

  it('should not have a connection after disconnecting', (done) => {
    const close = sinon.spy();
    const validExpressApp = {
      close,
      listen: (port, callback) => {
        callback(undefined, {});
      },
    };
    server.connect(validExpressApp, 8888).then(() => {
      server.disconnect();
      should.not.exist(server.connection());
      done();
    });
  });
});
