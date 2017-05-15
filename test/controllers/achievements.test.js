const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const achievements = require('../../src/controllers/achievements');
const Cache = require('../../src/utils/cache').Cache;

chai.use(chaiAsPromised);

// Achievement object stub

const testObj = {
  name: 'Test Achievement',
  organisation: 'Test Organisation',
  visual: 'http://www.test.com/images/test-achievement.png',
  description: 'Test Description',
  completion: [
    {
      id: 1,
      trigger: 'TEST_TRIGGER_ONE',
      multiplier: 3,
      conditions: [
        {
          property: 'propOne',
          operation: 'EQUAL',
          value: 1,
        },
      ],
    },
    {
      id: 2,
      trigger: 'TEST_TRIGGER_TWO',
      multiplier: 5,
      conditions: [
        {
          property: 'propTwo',
          operation: 'EQUAL',
          value: 'two',
        },
      ],
    },
  ],
  conditions: [
    {
      property: 'propThree',
      operation: 'EQUAL',
      value: 'three',
    },
  ],
  rewards: [
    {
      type: 'PRODUCT',
      property: 'point',
      value: 100,
    },
    {
      type: 'ACHIEVEMENT',
      property: 'point',
      value: 1,
    },
  ],
};

// achievements.create() fakes

const successCreate = (obj, callback) => {
  callback(undefined, testObj);
};

const errorCreate = (obj, callback) => {
  callback('Test error occurred');
};

// achievements.read() fakes

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

// achievements.readAll() fakes

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

// db.collection() fakes

const successCollection = {
  insertOne: (obj, callback) =>
    successCreate(obj, callback),
  findOne: (id, proj, callback) =>
    successFindOne(id, proj, callback),
  find: callback =>
    successFind(callback),
};

const errorCollection = {
  insertOne: (obj, callback) =>
    errorCreate(obj, callback),
  findOne: (id, proj, callback) =>
    errorFindOne(id, proj, callback),
  find: callback =>
    errorFind(callback),
};

// Unit tests

describe('Achievements controller', () => {
  describe('create', () => {
    it('should resolve if called with valid parameters', () =>
      achievements.create(successCollection, testObj)
        .should.be.fulfilled);

    it('should resolve if called with valid parameters', () =>
      achievements.create(successCollection, testObj)
        .should.be.fulfilled);

    it('should reject if called without event id', () =>
      achievements.create(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should reject if called with invalid collection', () =>
      achievements.create(errorCollection, testObj)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('readAll', () => {
    it('should ', () =>
      achievements.readAll(successCollection)
        .should.be.fulfilled);
    it('should', () =>
      achievements.readAll(errorCollection)
        .should.be.rejectedWith('Test error occurred'));
  });

  describe('cache', () => {
    beforeEach(() => {
      achievements.cache = new Cache();
    });
    it('should be a Cache instance', () => {
      achievements.cache.should.be.instanceof(Cache);
    });

    it('should be empty', () => {
      achievements.cache.get().should.deep.equal([]);
    });

    it('should populate cache on init', (done) => {
      const controller = ({
        readAll: () =>
          Promise.resolve([{ key: 1 }, { key: 2 }]),
      });
      achievements.cache.init(controller, successCollection)
        .then(() => {
          achievements.cache.get().should.deep.equal([{ key: 1 }, { key: 2 }]);
          done();
        });
    });
  });

  describe('getObjectToCreateFromRequest', () => {
    it('should succeed if request payload contains relevant fields', () => {
      const req = { body: testObj };
      return achievements.getObjectToCreateFromRequest(req)
        .should.be.fulfilled;
    });

    it('should return id from valid request', () => {
      const req = { body: testObj };
      return achievements.getObjectToCreateFromRequest(req)
        .should.eventually.deep.equal(testObj);
    });

    it('should return error if id is missing from payload', () => {
      const invalidTestObj = { description: 'Test' };
      const req = { body: invalidTestObj };
      return achievements.getObjectToCreateFromRequest(req)
        .should.be.rejectedWith('Invalid arguments');
    });

    it('should return error if id is missing from payload', () => {
      const invalidTestObj = { id: 'testId' };
      const req = { body: invalidTestObj };
      return achievements.getObjectToCreateFromRequest(req)
        .should.be.rejectedWith('Invalid arguments');
    });
  });
});
