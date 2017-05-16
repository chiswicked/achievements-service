const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const users = require('../../src/controllers/users');

chai.use(chaiAsPromised);

// User object stub

const testObj = {
  id: 'username',
};

const testObjArray = [{
  id: 'username1',
}, {
  id: 'username2',
}, {
  id: 'username3',
}];

// users.create() fakes

const successCreate = (obj, callback) => {
  callback(undefined, testObj);
};

const errorCreate = (obj, callback) => {
  callback('Test error occurred');
};

// users.read() fakes

const successFindOne = (id, proj, callback) => {
  callback(undefined, testObj);
};

const errorFindOne = (id, proj, callback) => {
  callback('Test error occurred');
};

// users.readAll() fakes

const successFind = () => ({
  toArray: callback =>
    callback(undefined, testObjArray),
});

const errorFind = () => ({
  toArray: callback =>
    callback('Test error occurred'),
});

// users.delete() fakes

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
  deleteOne: (id, callback) =>
    errorDelete(id, callback),
};

// Unit tests

describe('Users controller', () => {
  describe('create', () => {
    it('should work if called with valid parameters', () =>
      users.create(successCollection, testObj)
        .should.be.fulfilled);

    it('should return error if called without user id', () =>
      users.create(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should not work ', () =>
      users.create(errorCollection, testObj)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('read', () => {
    it('should work if called with valid parameters', () =>
      users.read(successCollection, 'username1')
        .should.be.fulfilled);

    it('should return error if called without user id', () =>
      users.read(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should not work ', () =>
      users.read(errorCollection, 'username1')
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('readAll', () => {
    it('should ', () =>
      users.readAll(successCollection)
        .should.be.fulfilled);
    it('should', () =>
      users.readAll(errorCollection)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('delete', () => {
    it('should work if called with valid parameters', () =>
      users.delete(successCollection, 'username1')
        .should.be.fulfilled);

    it('should return error if called without user id', () =>
      users.delete(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should return error if any database error', () =>
      users.delete(errorCollection, testObj)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('getIdFromRequestURI', () => {
    it('should succeed if request is valid', () => {
      const req = { params: { id: 'testId' } };
      return users.getIdFromRequestURI(req)
        .should.be.fulfilled;
    });

    it('should return id from valid request', () => {
      const req = { params: { id: 'testId' } };
      return users.getIdFromRequestURI(req)
        .should.eventually.equal('testId');
    });

    it('should return error if request is invalid', () => {
      const req = {};
      return users.getIdFromRequestURI(req)
        .should.be.rejectedWith('Invalid arguments');
    });
  });

  describe('getObjectToBeCreatedFromRequest', () => {
    it('should succeed if request payload contains relevant fields', () => {
      const req = { body: testObj };
      return users.getObjectToCreateFromRequest(req)
        .should.be.fulfilled;
    });

    it('should return id from valid request', () => {
      const req = { body: testObj };
      return users.getObjectToCreateFromRequest(req)
        .should.eventually.deep.equal(testObj);
    });

    it('should return error if id is missing from payload', () => {
      const invalidTestObj = { noId: 'testId' };
      const req = { body: invalidTestObj };
      return users.getObjectToCreateFromRequest(req)
        .should.be.rejectedWith('Invalid arguments');
    });
  });
});
