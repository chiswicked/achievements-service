const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const Cache = require('../../src/utils/cache').Cache;

chai.use(chaiAsPromised);

const emptyCtrl = ({
  readAll: () =>
    Promise.resolve([]),
});

const filledCtrl = ({
  readAll: () =>
    Promise.resolve([{ key: 1 }, { key: 2 }]),
});

const errorCtrl = ({
  readAll: () =>
    Promise.reject('Invalid controller action'),
});

let cache;

describe('Cache utils', () => {
  beforeEach(() => {
    cache = new Cache();
  });

  it('should construct with an empty cache holder', () =>
    cache.cachedObjects.should.deep.equal([]));

  it('should set uninitialise state', () =>
    cache.initialised.should.be.false);

  describe('init', () => {
    it('should resolve if controller is valid', () =>
      cache.init(emptyCtrl, {}).should.be.fulfilled);

    it('should set initialised state', () =>
      cache.init(emptyCtrl, {}).should.be.fulfilled);

    it('should reject if controller is invalid (1)', () =>
      cache.init({}, {}).should.be.rejected);

    it('should reject if controller is invalid (2)', () =>
      cache.init(errorCtrl, {})
        .should.be.rejectedWith('Invalid controller action'));
  });

  describe('get', () => {
    it('should return empty array if cache is uninitialised', () => {
      cache.get().should.deep.equal([]);
    });

    it('should return empty array if cache is empty', (done) => {
      cache.init(emptyCtrl, {})
        .then(() => {
          cache.get().should.deep.equal([]);
          done();
        });
    });

    it('should return array with items if cache had been populated', (done) => {
      cache.init(filledCtrl, {})
        .then(() => {
          cache.get().should.deep.equal([{ key: 1 }, { key: 2 }]);
          done();
        });
    });
  });

  describe('push', () => {
    it('should insert object', (done) => {
      cache.init(filledCtrl, {})
        .then(() => {
          cache.push({ key: 3 });
          cache.get().should.deep.equal([{ key: 1 }, { key: 2 }, { key: 3 }]);
          done();
        });
    });

    it('should return new array with cached items', (done) => {
      cache.init(filledCtrl, {})
        .then(() => {
          cache.push({ key: 3 })
            .should.deep.equal([{ key: 1 }, { key: 2 }, { key: 3 }]);
          done();
        });
    });
  });

  describe('clear', () => {
    it('should clear cache (1)', (done) => {
      cache.init(filledCtrl, {})
        .then(() => {
          cache.clear();
          cache.get().should.deep.equal([]);
          done();
        });
    });

    it('should clear cache (2)', (done) => {
      cache.init(filledCtrl, {})
        .then(() => {
          cache.clear();
          cache.initialised.should.be.false;
          done();
        });
    });
  });
});

