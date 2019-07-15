const { resolve } = require('path');
const Logger = require('@deity/falcon-logger');

module.exports = class BaseContainer {
  /**
   * Base Container constructor
   * @param {EventEmitter2} eventEmitter EventEmitter
   */
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  /**
   * Imports the specified module (via "require()") by checking installed NPM package
   * (by package name) and your local project folder.
   * @param {string} pathOrPackage Local path or package name of the module
   * @return {any} Imported module
   */
  importModule(pathOrPackage) {
    let module;
    try {
      module = require(pathOrPackage); // eslint-disable-line import/no-dynamic-require
      Logger.debug(`${this.constructor.name}: "${pathOrPackage}" loaded as a package`);
    } catch (packageError) {
      try {
        const modulePath = resolve(process.cwd(), pathOrPackage);
        module = require(modulePath); // eslint-disable-line import/no-dynamic-require
        Logger.debug(`${this.constructor.name}: "${pathOrPackage}" loaded from ${modulePath}`);
      } catch (pathError) {
        Logger.warn(
          `${this.constructor.name}: "${pathOrPackage}" cannot be loaded. Please check your config ("package" key)`
        );
      }
    }

    return module;
  }
};
