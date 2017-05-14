const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const service = require('../../src/utils/service-startup');

chai.use(chaiAsPromised);

const validMongoClient = {
  connect: (url, callback) => {
    callback(undefined, {
      collection: () => ({
        find: () => ({
          toArray: cb =>
            cb(undefined, []),
        }),
      }),
    });
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
  it('should resolve if connected with valid DB and Server instances', () =>
    service.start(validMongoClient, 'fake://url/', validExpressApp, 8888)
      .should.be.fulfilled);
  it('should reject if connected with invalid DB instance', () =>
    service.start(invalidMongoClient, 'fake://url/', validExpressApp, 8888)
      .should.be.rejectedWith('Connection to MongoDB failed'));

  it('should reject if connected with invalid Server instance', () =>
    service.start(validMongoClient, 'fake://url/', invalidExpressApp, 8888)
      .should.be.rejectedWith('Express App failed to start up'));
});
