const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../src/utils/db-connection');

const should = chai.should();

chai.use(chaiAsPromised);

describe('Mongo DB', () => {
  it('should not have a connection before connecting', () => {
    should.not.exist(db.connection());
  });

  it('should return error message if connected with invalid MongoClient', () => {
    const invalidMongoClient = {
      connect: (url, callback) => {
        callback(new Error('Connection to MongoDB failed'));
      },
    };
    return db.connect(invalidMongoClient, 'mock://url').should.be.rejected;
  });

  it('should return connection if connected with valid MongoClient', () => {
    const validMongoClient = {
      connect: (url, callback) => {
        callback(undefined, {});
      },
    };
    return db.connect(validMongoClient, 'mock://url').should.be.fulfilled;
  });

  it('should return connection after successfully connecting', () => {
    const validMongoClient = {
      connect: (url, callback) => {
        callback(undefined, { fake: 'db' });
      },
    };
    return db.connect(validMongoClient, 'mock://url').should.eventually.deep.equal({ fake: 'db' });
  });

  it('should set connection after successfully connecting', (done) => {
    const validMongoClient = {
      connect: (url, callback) => {
        callback(undefined, { fake: 'db' });
      },
    };
    db.connect(validMongoClient, 'mock://url').then(() => {
      db.connection().should.deep.equal({ fake: 'db' });
      done();
    });
  });

  it('should clear cache after disconnecting', (done) => {
    const close = sinon.spy();
    const validMongoClient = {
      connect: (url, callback) => {
        callback(undefined, { close });
      },
    };
    db.connect(validMongoClient, 'mock://url').then(() => {
      db.disconnect();
      close.should.have.been.calledOnce;
      done();
    });
  });

  it('should not have a connection after disconnecting', (done) => {
    const validMongoClient = {
      connect: (url, callback) => {
        callback(undefined, { close: () => { } });
      },
    };
    db.connect(validMongoClient, 'mock://url').then(() => {
      db.disconnect();
      should.not.exist(db.connection());
      done();
    });
  });
});
