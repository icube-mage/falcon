/* eslint-disable no-restricted-syntax, no-await-in-loop */
const Logger = require('@deity/falcon-logger');
const { Events } = require('@deity/falcon-server-env');
const BaseContainer = require('./BaseContainer');

/**
 * @typedef {object} ApiInstanceConfig
 * @property {string} name Api short-name (example: "api-wordpress")
 * @property {string} package Node package path (example: "@deity/falcon-wordpress-api")
 * @property {object} config Config object to be passed to Api Instance constructor
 */

/**
 * Api Engine acts as a container for API instances:
 * - manages all the instances
 * - returns the instances as dataSources (required by Apollo Server)
 */
module.exports = class ApiContainer extends BaseContainer {
  /**
   * Create an instance.
   * @param {EventEmitter2} eventEmitter EventEmitter
   */
  constructor(eventEmitter) {
    super(eventEmitter);
    /** @type {Map<string, ApiDataSource>} Array with API instances */
    this.dataSources = new Map();
  }

  /**
   * Instantiates apis based on passed configuration
   * @param {Object<string, ApiInstanceConfig>} apis Key-value list of APIs configuration
   * @return {undefined}
   */
  async registerApis(apis = {}) {
    for (const apiKey in apis) {
      if (Object.prototype.hasOwnProperty.call(apis, apiKey)) {
        const api = apis[apiKey];

        const { package: pkg, config = {} } = api;
        const ApiClass = this.importModule(pkg);
        if (!ApiClass) {
          return;
        }
        const apiInstanceCb = apolloServerConfig => {
          /** @type {ApiDataSource} */
          const apiInstance = new ApiClass({
            config,
            name: apiKey,
            apiContainer: this,
            eventEmitter: this.eventEmitter,
            gqlServerConfig: apolloServerConfig
          });

          this.eventEmitter.emit(Events.API_DATA_SOURCE_REGISTERED, {
            instance: apiInstance,
            name: apiInstance.name
          });

          Logger.debug(`ApiContainer: "${apiInstance.name}" API DataSource instantiated`);

          return apiInstance;
        };
        this.dataSources.set(apiKey, apiInstanceCb);
      }
    }
  }
};
