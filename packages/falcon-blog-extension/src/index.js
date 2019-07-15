const { Extension } = require('@deity/falcon-server-env');
const { resolve } = require('path');
const typeDefs = require('fs').readFileSync(resolve(__dirname, 'schema.graphql'), 'utf8');

/**
 * Simple blog extension.
 *
 * Features:
 * - list posts
 * - show single post
 */
module.exports = class Blog extends Extension {
  async getGraphQLConfig() {
    const gqlConfig = await super.getGraphQLConfig(typeDefs);

    Object.assign(gqlConfig.resolvers, {
      BackendConfig: {
        // Returning an empty object to make BlogConfig resolvers work
        blog: () => ({})
      }
    });

    return gqlConfig;
  }
};
