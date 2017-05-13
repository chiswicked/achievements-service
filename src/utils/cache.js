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
    this.initialised = false;
  }

  /**
  * Populates cache with objects from database collection
  *
  * @param controller Controller handling retrieval of objects from database
  * @param collection Collection holding objects in database
  * @public
  */
  init(controller, collection) {
    return new Promise((resolve, reject) => {
      controller.readAll(collection)
        .then((data) => {
          this.cachedObjects = data.slice();
          this.initialised = true;
          resolve();
        })
        .catch((err) => { reject(err); });
    });
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

  /**
  * Clears cache
  * @public
  */
  clear() {
    this.cachedObjects = [];
    this.initialised = false;
  }
};
