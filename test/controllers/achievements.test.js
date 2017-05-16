const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const achievements = require('../../src/controllers/achievements');
const Cache = require('../../src/utils/cache').Cache;

chai.use(chaiAsPromised);

// Achievement object stub

const testObjZero = {
  name: 'Test Zero Achievement',
  organisation: 'Test Zero Organisation',
  visual: 'http://www.testzero.com/images/testzero-achievement.png',
  description: 'Test Zero Description',
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

const testObjOne = {
  _id: 'abcde12345',
  name: 'Test One Achievement',
  organisation: 'Test One Organisation',
  visual: 'http://www.testone.com/images/testone-achievement.png',
  description: 'Test One Description',
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

const testObjTwo = {
  _id: 'fghij67890',
  name: 'Test Two Achievement',
  organisation: 'Test Two Organisation',
  visual: 'http://www.testtwo.com/images/testtwo-achievement.png',
  description: 'Test Two Description',
  completion: [
    {
      id: 1,
      trigger: 'TEST_TRIGGER_TWO',
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
      trigger: 'TEST_TRIGGER_THREE',
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


const controller = ({
  readAll: () =>
    Promise.resolve([testObjOne, testObjTwo]),
});

// achievements.create() fakes

const successCreate = (obj, callback) => {
  callback(undefined, testObjOne);
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
      achievements.create(successCollection, testObjOne)
        .should.be.fulfilled);

    it('should resolve if called with valid parameters', () =>
      achievements.create(successCollection, testObjOne)
        .should.be.fulfilled);

    it('should reject if called without event id', () =>
      achievements.create(successCollection)
        .should.be.rejectedWith('Invalid arguments'));

    it('should reject if called with invalid collection', () =>
      achievements.create(errorCollection, testObjOne)
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
      achievements.cache.init(controller, successCollection)
        .then(() => {
          achievements.cache.get().should.deep.equal([testObjOne, testObjTwo]);
          done();
        });
    });
  });

  describe('getObjectToCreateFromRequest', () => {
    it('should succeed if request payload contains relevant fields', () => {
      const req = { body: testObjZero };
      return achievements.getObjectToCreateFromRequest(req)
        .should.be.fulfilled;
    });

    it('should return id from valid request', () => {
      const req = { body: testObjZero };
      return achievements.getObjectToCreateFromRequest(req)
        .should.eventually.deep.equal(testObjZero);
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

  let cache;

  describe('getTriggeredAchievementsFromCache', () => {
    beforeEach(() => {
      cache = new Cache();
    });
    it('should return empty array if cache is empty', () => {
      achievements.getTriggeredAchievementsFromCache(cache, 'TEST_TRIGGER', 1)
        .should.deep.equal([]);
    });
    it('should return empty array if trigger does not match any cached items', (done) => {
      cache.init(controller, successCollection)
        .then(() => {
          achievements.getTriggeredAchievementsFromCache(cache, 'TEST_TRIGGER', 1)
            .should.deep.equal([]);
          done();
        });
    });
    it('should return array if trigger does match a cached item (1)', (done) => {
      cache.init(controller, successCollection)
        .then(() => {
          achievements.getTriggeredAchievementsFromCache(cache, 'TEST_TRIGGER_ONE', 1)
            .should.have.lengthOf(1);
          done();
        });
    });
    it('should return array if trigger does match a cached item (2)', (done) => {
      cache.init(controller, successCollection)
        .then(() => {
          achievements.getTriggeredAchievementsFromCache(cache, 'TEST_TRIGGER_TWO', 1)
            .should.have.lengthOf(2);
          done();
        });
    });
    // TODO Add checking returned object structure
  });
});
