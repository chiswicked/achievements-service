const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const cache = require('../../src/utils/cache');

chai.use(chaiAsPromised);

const emptyCtrl = ({
  readAll: () =>
    Promise.resolve([]),
});

const filledCtrlV1 = ({
  readAll: () =>
    Promise.resolve([{ key: 1 }, { key: 2 }]),
});

const filledCtrlV2 = ({
  readAll: () =>
    Promise.resolve([{ key: 3 }, { key: 4 }, { key: 5 }]),
});

const errorCtrl = ({
  readAll: () =>
    Promise.reject('Invalid controller action'),
});

describe.only('Cache', () => {
  describe('factory call', () => {
    it('should resolve if controller is valid', () =>
      cache.create(emptyCtrl, {})
        .should.eventually.be.fulfilled);
    it('should return a new instance', (done) => {
      cache.create(emptyCtrl, {})
        .then((cacheObj) => {
          cacheObj.should.be.an.instanceof(cache.Cache);
          done();
        });
    });
    it('should reject if controller is invalid (1)', () =>
      cache.create({}, {})
        .should.eventually.be.rejected);
    it('should reject if controller is invalid (2)', () =>
      cache.create(errorCtrl, {})
        .should.eventually.be.rejectedWith('Invalid controller action'));
    it('should produce distinct instances', (done) => {
      let obj1;
      let obj2;
      cache.create(filledCtrlV1, {})
        .then((cacheObj1) => {
          obj1 = cacheObj1;
          cache.create(filledCtrlV2, {})
            .then((cacheObj2) => {
              obj2 = cacheObj2;
              obj1.get().should.not.deep.equal(obj2.get());
              done();
            });
        });
    });
  });
  describe('instance', () => {
    it('should return empty array if cache is empty', (done) => {
      cache.create(emptyCtrl, {})
        .then((cacheObj) => {
          cacheObj.get().should.deep.equal([]);
          done();
        });
    });
    it('should return array with items if cache had been populated', (done) => {
      cache.create(filledCtrlV1, {})
        .then((cacheObj) => {
          cacheObj.get().should.deep.equal([{ key: 1 }, { key: 2 }]);
          done();
        });
    });
    it('should insert object', (done) => {
      cache.create(filledCtrlV1, {})
        .then((cacheObj) => {
          cacheObj.push({ key: 3 });
          cacheObj.get().should.deep.equal([{ key: 1 }, { key: 2 }, { key: 3 }]);
          done();
        });
    });
  });
});
