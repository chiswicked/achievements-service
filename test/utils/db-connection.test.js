const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../src/utils/db-connection');

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

describe('Mongo DB', () => {
  it('should not have a connection before connecting', () => {
    should.not.exist(db.connection());
  });

  it('should return error message if connected with invalid MongoClient', () =>
    db.connect(invalidMongoClient, 'fake://url')
      .should.be.rejected);

  it('should connect if connected with valid MongoClient', () =>
    db.connect(validMongoClient, 'fake://url')
      .should.be.fulfilled);

  it('should return connection after successfully connecting', () =>
    db.connect(validMongoClient, 'fake://url')
      .should.eventually.deep.equal({ fake: 'db' }));

  it('should set connection after successfully connecting', (done) => {
    db.connect(validMongoClient, 'fake://url')
      .then(() => {
        db.connection().should.deep.equal({ fake: 'db' });
        done();
      });
  });

  it('should clear cache after disconnecting', (done) => {
    const close = sinon.spy();
    const spyingMongoClient = {
      connect: (url, callback) => {
        callback(undefined, { close });
      },
    };

    db.connect(spyingMongoClient, 'fake://url')
      .then(() => {
        db.disconnect();
        close.should.have.been.calledOnce;
        done();
      });
  });

  it('should not have a connection after disconnecting', (done) => {
    const validMongoClientWithClose = {
      connect: (url, callback) => {
        callback(undefined, { close: () => {} });
      },
    };

    db.connect(validMongoClientWithClose, 'fake://url')
      .then(() => {
        db.disconnect();
        should.not.exist(db.connection());
        done();
      });
  });
});
