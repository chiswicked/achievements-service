const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const express = require('express');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const server = require('../../src/utils/server-connection');

const should = chai.should();

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('HTTP Server', () => {
  let validExpressApp;
  let invalidExpressApp;

  beforeEach(() => {
    validExpressApp = () => { };
    validExpressApp.listen = (port, callback) => {
      callback(undefined, { fake: 'server' });
    };
    invalidExpressApp = () => { };
    invalidExpressApp.listen = (port, callback) => {
      callback(new Error('Express App failed to start up'));
    };
  });

  afterEach(() => {
    validExpressApp = null;
    invalidExpressApp = null;
  });

  it('should not have a connection before connecting', () => {
    should.not.exist(server.connection());
  });

  it('should return error message if connected with invalid Express app', () =>
    server.connect(invalidExpressApp, 8888)
      .should.be.rejectedWith('Express App failed to start up'));

  it('should return error message if port is already in use', () => {
    const realExpressApp = express();
    realExpressApp.listen = () => {
      realExpressApp.emit('error', 'Mysterious error occurred');
    };
    return server.connect(realExpressApp, 8888)
      .should.be.rejectedWith('Mysterious error occurred');
  });

  it('should succeed if connected with valid Express app', () =>
    server.connect(validExpressApp, 8888)
      .should.be.fulfilled);

  it('should start listening if connected with valid Express app', (done) => {
    const spy = sinon.spy(validExpressApp, 'listen');
    return server.connect(validExpressApp, 8888)
      .then(() => {
        spy.should.have.been.calledWith(8888);
        validExpressApp.listen.restore();
        done();
      });
  });

  it('should return connection after successfully connecting', () =>
    server.connect(validExpressApp, 8888)
      .should.eventually.deep.equal(validExpressApp));

  it('should set connection after successfully connecting', (done) => {
    server.connect(validExpressApp, 8888)
      .then(() => {
        server.connection().should.deep.equal(validExpressApp);
        done();
      });
  });

  it('should clear cache after disconnecting', (done) => {
    validExpressApp.close = () => { };
    sinon.spy(validExpressApp, 'close');

    server.connect(validExpressApp, 8888)
      .then(() => {
        server.disconnect();
        validExpressApp.close.should.have.been.calledOnce;
        validExpressApp.close.restore();
        done();
      });
  });

  it('should not have a connection after disconnecting', (done) => {
    validExpressApp.close = () => { };

    server.connect(validExpressApp, 8888)
      .then(() => {
        server.disconnect();
        should.not.exist(server.connection());
        done();
      });
  });
});
