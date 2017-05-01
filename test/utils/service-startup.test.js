const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const startup = require('../../src/utils/service-startup');

const should = chai.should();

chai.use(chaiAsPromised);

const validMongoClient = {
  connect: (url, callback) => {
    callback(undefined, { fake: 'db' });
  },
};
const invalidMongoClient = {
  connect: (url, callback) => {
    callback(new Error('Connection to MongoDB failed'));
  },
};

const validExpressApp = {
  listen: (port, callback) => {
    callback(undefined, { fake: 'server' });
  },
};
const invalidExpressApp = {
  listen: (port, callback) => {
    callback(new Error('Express App failed to start up'));
  },
};

describe('Service', () => {
  it('should not have a DB connection before connecting', () => {
    should.not.exist(startup.connection.db());
  });

  it('should not have a Server connection before connecting', () => {
    should.not.exist(startup.connection.server());
  });

  it('should return error message if connected with invalid DB instance', () =>
    startup.connect(invalidMongoClient, 'fake://url/', validExpressApp, 8888)
      .should.be.rejectedWith('Connection to MongoDB failed'));

  it('should return error message if connected with invalid Server instance', () =>
    startup.connect(validMongoClient, 'fake://url/', invalidExpressApp, 8888)
      .should.be.rejectedWith('Express App failed to start up'));

  it('should resolve if connected with valid DB and Server instances', () =>
    startup.connect(validMongoClient, 'fake://url/', validExpressApp, 8888)
      .should.be.fulfilled);

  it('should return DB and Server connections after successfully connecting', () =>
    startup.connect(validMongoClient, 'fake://url/', validExpressApp, 8888)
      .should.eventually.become({ db: { fake: 'db' }, server: validExpressApp }));

  it('should set DB and Server connections after successfully connecting', (done) => {
    startup.connect(validMongoClient, 'fake://url/', validExpressApp, 8888).then(() => {
      startup.connection.db().should.deep.equal({ fake: 'db' });
      startup.connection.server().should.deep.equal(validExpressApp);
      done();
    });
  });

  it('should clear cache after disconnecting', (done) => {
    const closeDb = sinon.spy();
    const spyingMongoClient = {
      connect: (url, callback) => {
        callback(undefined, { close: closeDb });
      },
    };

    const closeServer = sinon.spy();
    const spyingExpressApp = {
      close: closeServer,
      listen: (port, callback) => {
        callback(undefined, {});
      },
    };

    startup.connect(spyingMongoClient, 'fake://url/', spyingExpressApp, 8888)
      .then(() => {
        startup.disconnect();
        closeDb.should.have.been.calledOnce;
        closeServer.should.have.been.calledOnce;
        done();
      });
  });

  it('should not have a connection after disconnecting', (done) => {
    const validMongoClientWithClose = {
      connect: (url, callback) => {
        callback(undefined, { close: () => { }, fake: 'db' });
      },
    };

    const validExpressAppWithClose = {
      close: () => { },
      listen: (port, callback) => {
        callback(undefined, { fake: 'server' });
      },
    };

    startup.connect(validMongoClientWithClose, 'fake://url/', validExpressAppWithClose, 8888)
      .then(() => {
        startup.disconnect();
        should.not.exist(startup.connection.db());
        should.not.exist(startup.connection.server());
        done();
      });
  });
});
