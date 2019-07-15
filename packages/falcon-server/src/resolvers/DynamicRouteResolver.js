const Logger = require('@deity/falcon-logger');

/**
 * Dynamic Route GraphQL Resolver.
 *
 * Dynamic {@link DynamicRouteResolver#fetchUrl url discovery} to connect multiple external api generated urls
 * (example: sale.html)
 * It provides back information about entity type for passed url:
 *
 * @example
 * {
 *  type: 'shop-category',
 *  path: '/category/page/path/',
 *  id: 1
 * }
 *
 * That information can be used for fetching detailed data of that url.
 */
module.exports = class DynamicRouteResolver {
  /**
   * @param {ExtensionContainer} extensionContainer Instance of ExtensionContainer
   */
  constructor(extensionContainer) {
    this.extensionContainer = extensionContainer;
  }

  /**
   * Reorder handlers based on request path to boost performance,
   * for example 99% urls ending with .html are Magento generated
   * @param {object} context GQL context
   * @param {String} path - request path
   * @return {Object[]} list of apis that supports url method
   */
  getDynamicRouteHandlers(context, path) {
    return this.extensionContainer
      .getExtensionsByCriteria(ext => ext.getFetchUrlPriority && ext.getFetchUrlPriority(context, path) > 0)
      .sort((first, second) =>
        second.getFetchUrlPriority(context, path) < first.getFetchUrlPriority(context, path) ? 1 : -1
      );
  }

  /**
   * Fetches url data from remote API. Signature of the method must match the signature of GraphQL resolvers
   * @param {Object} obj - result returned from parent query
   * @param {Object} args - object with arguments passed to the query
   * @param {Object} context - execution context
   * @param {Object} info - GraphQL info object
   * @return {Object} fetched and processed data
   */
  async fetchUrl(obj, args, context, info) {
    const { path } = args;

    let response;
    const resolvers = this.getDynamicRouteHandlers(context, path);

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-continue */

    for (const resolver of resolvers) {
      Logger.debug(`Checking ${resolver.name} extension for url: "${path}"...`);

      try {
        // todo this will produce different cache keys for storeCode / blog entry combination
        //  this.api.applySessionContext(params, session);
        response = await resolver.fetchUrl(obj, args, context, info);

        if (response) {
          break;
        }
      } catch (e) {
        // get status code from ApolloExtension internals
        if (e.extensions && e.extensions.response && e.extensions.response.status === 404) {
          response = null;
        } else {
          throw e;
        }
      }
    }

    if (!response) {
      return null;
    }

    /* eslint-enable no-continue */
    /* eslint-enable no-await-in-loop */
    /* eslint-enable no-restricted-syntax */

    if (response) {
      response.path = path;
    }

    return response;
  }
};
