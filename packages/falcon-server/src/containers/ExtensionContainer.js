/* eslint-disable no-restricted-syntax, no-await-in-loop, no-underscore-dangle */
const Logger = require('@deity/falcon-logger');
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools');
const { Events } = require('@deity/falcon-server-env');
const BaseContainer = require('./BaseContainer');

/**
 * @typedef {object} ExtensionInstanceConfig
 * @property {string} package Node package path (example: "@deity/falcon-blog-extension")
 * @property {object} config Config object to be passed to Extension Instance constructor
 * @property {string} config.api API instance name to be used by the Extension
 */

/**
 * @typedef {object} BackendConfig
 * @property {string[]} locales
 * @property {string} defaultLocale
 */

/**
 * Holds extensions and expose running hooks for for them.
 */
module.exports = class ExtensionContainer extends BaseContainer {
  /**
   * Creates extensions container
   * @param {EventEmitter2} eventEmitter EventEmitter
   */
  constructor(eventEmitter) {
    super(eventEmitter);
    /** @type {Map<string,Extension>} */
    this.extensions = new Map();
  }

  /**
   * Instantiates extensions based on passed configuration and registers event handlers for them
   * @param {Object<string, ExtensionInstanceConfig>} extensions Key-value list of extension configurations
   * @param {Map<string, ApiDataSource>} dataSources Map of API DataSources
   */
  async registerExtensions(extensions, dataSources) {
    for (const extKey in extensions) {
      if (Object.prototype.hasOwnProperty.call(extensions, extKey)) {
        const extension = extensions[extKey];

        const ExtensionClass = this.importModule(extension.package);
        if (!ExtensionClass) {
          return;
        }
        const extensionInstance = new ExtensionClass({
          config: extension.config || {},
          name: extKey,
          extensionContainer: this,
          eventEmitter: this.eventEmitter
        });

        Logger.debug(`ExtensionContainer: "${extensionInstance.name}" added to the list of extensions`);
        const { api: apiName } = extension.config || {};
        if (apiName && dataSources.has(apiName)) {
          extensionInstance.api = dataSources.get(apiName);
          Logger.debug(
            `ExtensionContainer: "${apiName}" API DataSource assigned to "${extensionInstance.name}" extension`
          );
        } else {
          Logger.debug(`ExtensionContainer: Extension "${extensionInstance.name}" has no API defined`);
        }
        this.extensions.set(extensionInstance.name, extensionInstance);

        await this.eventEmitter.emitAsync(Events.EXTENSION_REGISTERED, {
          instance: extensionInstance,
          name: extensionInstance.name
        });
      }
    }
  }

  /**
   * Initializes each registered extension (in sequence)
   * @param {object} obj Parent object
   * @param {object} args GQL args
   * @param {object} context GQL context
   * @param {object} info GQL info
   * @return {BackendConfig} Merged config
   */
  async fetchBackendConfig(obj, args, context, info) {
    const configs = [];

    // initialization of extensions cannot be done in parallel because of race condition
    for (const [extName, ext] of this.extensions) {
      Logger.debug(`ExtensionContainer: Fetching "${extName}" API backend config`);
      const extConfig = await ext.fetchApiBackendConfig(obj, args, context, info);
      if (extConfig) {
        configs.push(extConfig);
      }
    }

    return this.mergeConfigs(configs);
  }

  /**
   * Merges
   * @param {Object[]} configs List of API config
   * @return {BackendConfig} Merged config
   */
  mergeConfigs(configs) {
    return configs.reduce((prev, current) => {
      if (!current) {
        return prev;
      }

      const { locales: prevLocales } = prev;
      const { locales: currLocales } = current;

      const isPrevLocalesArr = Array.isArray(prevLocales);
      const isCurrLocalesArr = Array.isArray(currLocales);

      let mergedLocales;

      // Merging "locales" values (leaving only those that exist on every API)
      if (isCurrLocalesArr && isPrevLocalesArr) {
        mergedLocales = currLocales.filter(loc => prevLocales.indexOf(loc) >= 0);
      } else {
        mergedLocales = isCurrLocalesArr && !isPrevLocalesArr ? currLocales : prevLocales;
      }

      return {
        defaultLocale: prev.defaultLocale || current.defaultLocale,
        locales: mergedLocales
      };
    }, {});
  }

  /**
   * Creates a complete configuration for ApolloServer
   * @param {Object} defaultConfig - default configuration that should be used
   * @return {Object} resolved configuration
   */
  async createGraphQLConfig(defaultConfig = {}) {
    const config = Object.assign(
      {
        schemas: [],
        // contextModifiers will be used as helpers - it will gather all the context functions and we'll invoke
        // all of them when context will be created. All the results will be merged to produce final context
        contextModifiers: defaultConfig.context ? [defaultConfig.context] : []
      },
      defaultConfig,
      {
        resolvers: defaultConfig.resolvers && !Array.isArray(defaultConfig.resolvers) ? [defaultConfig.resolvers] : []
      }
    );

    for (const [extName, ext] of this.extensions) {
      if (typeof ext.getGraphQLConfig === 'function') {
        const extConfig = await ext.getGraphQLConfig();
        this.mergeGraphQLConfig(config, extConfig, extName);
      }
    }

    // define context handler that invokes all context handlers delivered by extensions
    const { contextModifiers } = config;
    config.context = arg => {
      let ctx = {};
      contextModifiers.forEach(modifier => {
        ctx = Object.assign(ctx, typeof modifier === 'function' ? modifier(arg, ctx) : modifier);
      });
      return ctx;
    };

    config.schema = mergeSchemas({
      schemas: [makeExecutableSchema({ typeDefs: config.schemas })],
      resolvers: config.resolvers
    });

    // remove processed fields
    delete config.contextModifiers;
    delete config.resolvers;
    delete config.schemas;

    return config;
  }

  mergeGraphQLConfig(dest, source, extensionName) {
    Logger.debug(`ExtensionContainer: merging "${extensionName}" extension GraphQL config`);

    Object.keys(source).forEach(name => {
      if (!name || typeof source[name] === 'undefined') {
        return;
      }
      const value = source[name];
      const valueArray = Array.isArray(value) ? value : [value];

      switch (name) {
        case 'schema':
        case 'schemas':
          valueArray.forEach(schemaItem => {
            if (typeof schemaItem !== 'string') {
              Logger.warn(
                `ExtensionContainer: "${extensionName}" extension contains non-string GraphQL Schema definition,` +
                  `please check its "${name}" configuration and make sure all items are represented as strings. ${schemaItem}`
              );
            }
          });

          dest.schemas.push(...valueArray);
          break;
        case 'resolvers':
          dest.resolvers.push(...valueArray);
          break;
        case 'context':
          dest.contextModifiers.push(value);
          break;
        case 'dataSources':
          Object.assign(dest.dataSources, value);
          break;
        default:
          // todo: consider overriding the properties that we don't have custom merge logic for yet instead of
          // skipping those
          // that would give a possibility to override any kind of ApolloServer setting but the downside is
          // that one extension could override setting returned by previous one
          Logger.warn(
            `ExtensionContainer: "${extensionName}" extension wants to use GraphQL "${name}" option which is not supported by Falcon extensions api yet - skipping that option`
          );
          break;
      }
    });
  }

  /**
   * Returns array of extensions for which filterFn function called with extension instance as a param returns true
   * @param {function} filterFn - function to be executed for each extension instance
   * @returns {array} matched extensions
   */
  getExtensionsByCriteria(filterFn) {
    const result = [];
    this.extensions.forEach(ext => filterFn(ext) && result.push(ext));
    return result;
  }
};
