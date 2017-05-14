const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const events = require('../../src/controllers/events');
const Cache = require('../../src/utils/cache').Cache;

chai.use(chaiAsPromised);

// Event object stub

const testObj = {
  id: 'TEST_EVENT',
  description: 'Test description',
};

// events.create() fakes

const successCreate = (obj, callback) => {
  callback(undefined, testObj);
};

const errorCreate = (obj, callback) => {
  callback('Test error occurred');
};

// events.read() fakes

const successFindOne = (id, proj, callback) => {
  callback(
    undefined,
    {
      id: 'TEST_EVENT_ONE',
      description: 'Test description one',
    });
};

const errorFindOne = (id, proj, callback) => {
  callback('Test error occurred');
};

// events.readAll() fakes

const successFind = () => ({
  toArray: callback =>
    callback(
      undefined,
      [{
        id: 'TEST_EVENT_ONE',
        description: 'Test description one',
      }, {
        id: 'TEST_EVENT_TWO',
        description: 'Test description two',
      }, {
        id: 'TEST_EVENT_THREE',
        description: 'Test description three',
      }]),
});

const errorFind = () => ({
  toArray: callback =>
    callback('Test error occurred'),
});

// events.update() fakes

const successUpdate = (obj, set, proj, callback) => {
  callback(undefined, testObj);
};

const errorUpdate = (obj, set, proj, callback) => {
  callback('Test error occurred');
};

// events.delete() fakes

const successDelete = (id, callback) => {
  callback(undefined, testObj);
};

const errorDelete = (id, callback) => {
  callback('Test error occurred');
};

// db.collection() fakes

const successCollection = {
  insertOne: (obj, callback) =>
    successCreate(obj, callback),
  findOne: (id, proj, callback) =>
    successFindOne(id, proj, callback),
  find: callback =>
    successFind(callback),
  findOneAndUpdate: (obj, set, proj, callback) =>
    successUpdate(obj, set, proj, callback),
  deleteOne: (id, callback) =>
    successDelete(id, callback),
};

const errorCollection = {
  insertOne: (obj, callback) =>
    errorCreate(obj, callback),
  findOne: (id, proj, callback) =>
    errorFindOne(id, proj, callback),
  find: callback =>
    errorFind(callback),
  findOneAndUpdate: (obj, set, proj, callback) =>
    errorUpdate(obj, set, proj, callback),
  deleteOne: (id, callback) =>
    errorDelete(id, callback),
};

// Unit tests

describe('Events controller', () => {
  describe('create', () => {
    it('should work if called with valid parameters', () =>
      events.create(successCollection, testObj)
        .should.be.fulfilled);

    it('should work if called with valid parameters', () =>
      events.create(successCollection, testObj)
        .should.be.fulfilled);

    it('should return error if called without event id', () =>
      events.create(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should not work ', () =>
      events.create(errorCollection, testObj)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('read', () => {
    it('should work if called with valid parameters', () =>
      events.read(successCollection, 'TEST_EVENT')
        .should.be.fulfilled);

    it('should return error if called without event id', () =>
      events.read(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should not work ', () =>
      events.read(errorCollection, 'TEST_EVENT')
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('readAll', () => {
    it('should ', () =>
      events.readAll(successCollection)
        .should.be.fulfilled);
    it('should', () =>
      events.readAll(errorCollection)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('update', () => {
    it('should work if called with valid parameters', () =>
      events.update(successCollection, testObj)
        .should.be.fulfilled);

    it('should return error if called without event id', () =>
      events.update(successCollection, { id: 'TEST_EVENT' })
        .should.be.rejectedWith('Invalid arguments'));

    it('should return error if called without event description', () =>
      events.update(successCollection, { description: 'Test description' })
        .should.be.rejectedWith('Invalid arguments'));

    it('should return error if any database error', () =>
      events.update(errorCollection, testObj)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('delete', () => {
    it('should work if called with valid parameters', () =>
      events.delete(successCollection, 'TEST_EVENT')
        .should.be.fulfilled);

    it('should return error if called without event id', () =>
      events.delete(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should return error if any database error', () =>
      events.delete(errorCollection, testObj)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('cache', () => {
    beforeEach(() => {
      events.cache = new Cache();
    });
    it('should be a Cache instance', () => {
      events.cache.should.be.instanceof(Cache);
    });

    it('should be empty', () => {
      events.cache.get().should.deep.equal([]);
    });

    it('should populate cache on init', (done) => {
      const controller = ({
        readAll: () =>
          Promise.resolve([{ key: 1 }, { key: 2 }]),
      });
      events.cache.init(controller, successCollection)
        .then(() => {
          events.cache.get().should.deep.equal([{ key: 1 }, { key: 2 }]);
          done();
        });
    });
  });

  describe('getIdFromRequestURI', () => {
    it('should succeed if request is valid', () => {
      const req = { params: { id: 'testId' } };
      return events.getIdFromRequestURI(req)
        .should.be.fulfilled;
    });

    it('should return id from valid request', () => {
      const req = { params: { id: 'testId' } };
      return events.getIdFromRequestURI(req)
        .should.eventually.equal('testId');
    });

    it('should return error if request is invalid', () => {
      const req = {};
      return events.getIdFromRequestURI(req)
        .should.be.rejectedWith('Invalid arguments');
    });
  });

  describe('getObjectToBeCreatedFromRequest', () => {
    it('should succeed if request payload contains relevant fields', () => {
      const req = { body: testObj };
      return events.getObjectToCreateFromRequest(req)
        .should.be.fulfilled;
    });

    it('should return id from valid request', () => {
      const req = { body: testObj };
      return events.getObjectToCreateFromRequest(req)
        .should.eventually.deep.equal(testObj);
    });

    it('should return error if id is missing from payload', () => {
      const invalidTestObj = { description: 'Test' };
      const req = { body: invalidTestObj };
      return events.getObjectToCreateFromRequest(req)
        .should.be.rejectedWith('Invalid arguments');
    });

    it('should return error if id is missing from payload', () => {
      const invalidTestObj = { id: 'testId' };
      const req = { body: invalidTestObj };
      return events.getObjectToCreateFromRequest(req)
        .should.be.rejectedWith('Invalid arguments');
    });
  });

  describe('getObjectToUpdateFromRequest', () => {
    it('should succeed if request payload and parameters contains relevant fields', () => {
      const req = {
        params: { id: 'testId' },
        body: { description: 'Test' },
      };
      return events.getObjectToUpdateFromRequest(req)
        .should.be.fulfilled;
    });

    it('should return id from valid request', () => {
      const req = {
        params: { id: 'testId' },
        body: { description: 'Test' },
      };
      return events.getObjectToUpdateFromRequest(req)
        .should.eventually.deep.equal({ id: 'testId', description: 'Test' });
    });

    it('should return error if id is missing from parameters', () => {
      const req = {
        params: {},
        body: { description: 'Test' },
      };
      return events.getObjectToUpdateFromRequest(req)
        .should.be.rejectedWith('Invalid arguments');
    });

    it('should return error if id is missing from payload', () => {
      const req = {
        params: { id: 'testId' },
        body: {},
      };
      return events.getObjectToUpdateFromRequest(req)
        .should.be.rejectedWith('Invalid arguments');
    });
  });
});
