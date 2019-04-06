const { Extension } = require('@deity/falcon-server-env');
const { resolve } = require('path');
const typeDefs = require('fs').readFileSync(resolve(__dirname, 'schema.graphql'), 'utf8');

/**
 * Extension that implements shop features
 */
class Shop extends Extension {
  async getGraphQLConfig() {
    const gqlConfig = await super.getGraphQLConfig(typeDefs);

    Object.assign(gqlConfig.resolvers, {
      BackendConfig: {
        // Returning an empty object to make ShopConfig resolvers work
        shop: () => ({})
      },
      ShopConfig: {
        activeCurrency: (_, __, context) => this.getApiSession(context).currency,
        activeStore: (_, __, context) => this.getApiSession(context).storeCode
      }
    });

    return gqlConfig;
  }
}

module.exports = Shop;
module.exports.Schema = typeDefs;
