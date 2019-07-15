/* eslint-disable no-restricted-syntax, no-await-in-loop, no-underscore-dangle */
const Logger = require('@deity/falcon-logger');
const BaseContainer = require('./BaseContainer');

module.exports = class EndpointContainer extends BaseContainer {
  /**
   * Creates endpoints container
   * @param {EventEmitter2} eventEmitter EventEmitter
   */
  constructor(eventEmitter) {
    super(eventEmitter);
    /** @type {Array} */
    this.entries = [];
  }

  /**
   * Instantiates endpoints based on the passed configuration and registers event handlers for them
   * @param {Object} config Configuration object of endpoints
   */
  async registerEndpoints(config) {
    for (const endpointKey in config) {
      if (Object.prototype.hasOwnProperty.call(config, endpointKey)) {
        const endpointManagerConfig = config[endpointKey];

        const EndpointManagerClass = this.importModule(endpointManagerConfig.package);
        if (!EndpointManagerClass) {
          return;
        }
        const endpointManager = new EndpointManagerClass({
          config: endpointManagerConfig.config || {},
          name: endpointKey,
          eventEmitter: this.eventEmitter
        });

        Logger.debug(`${this.constructor.name}: "${endpointManager.name}" Endpoint Manager has been instantiated`);
        this.entries.push(...endpointManager.getEntries());
      }
    }
  }
};
