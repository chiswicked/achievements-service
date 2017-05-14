/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Cache util class created through factory method
 * @private
 */
module.exports.Cache = class {
  constructor() {
    this.cachedObjects = [];
    this.initialized = false;
  }

/**
   * Populates cache with objects from supplied collection
   *
   * @param controller Controller handling retrieval of objects from database
   * @param collection Collection holding objects in database
   * @public
   */
  init(controller, collection) {
    return new Promise((success, failure) => {
      controller.readAll(collection)
        .then((data) => {
          this.cachedObjects = data;
          this.initialized = true;
          success();
        })
        .catch((err) => { failure(err); });
    });
  }

  /**
  * Returns all objects from cache
  *
  * @return {Array}
  * @public
  */
  get() {
    return this.cachedObjects.slice();
  }

  /**
  * Inserts a new object into cache
  *
  * @return {Array}
  * @public
  */
  push(obj) {
    this.cachedObjects.push(obj);
    return this.get();
  }

  /**
  * Clears cache
  * @public
  */
  clear() {
    this.cachedObjects = [];
    this.initialized = false;
  }
};
