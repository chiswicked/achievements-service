/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Cache util class created through factory method
 * @private
 */
const Cache = module.exports.Cache = class {
  constructor(cachedObjects) {
    this.cachedObjects = cachedObjects;
  }

  /**
  * Returns all achievement objects from cache
  *
  * @return {Array}
  * @public
  */
  get() {
    return this.cachedObjects.slice();
  }

  /**
  * Inserts a new achievement object into cache
  *
  * @return {Array}
  * @public
  */
  push(obj) {
    this.cachedObjects.push(obj);
    return this.get();
  }
};

/**
 * Factory method returning a cache instance populated with objects from supplied collection
 *
 * @param controller Controller handling retrieval of objects from database
 * @param collection Collection holding objects in database
 * @public
 */
module.exports.create = (controller, collection) =>
  new Promise((success, failure) => {
    controller.readAll(collection)
      .then((data) => { success(new Cache(data.slice())); })
      .catch((err) => { failure(err); });
  });
