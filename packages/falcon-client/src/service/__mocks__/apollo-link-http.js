// eslint-disable-next-line import/no-extraneous-dependencies
import { SchemaLink } from 'apollo-link-schema';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeExecutableSchema } from 'graphql-tools';

const createHttpLink = ({ typeDefs, resolvers }) => {
  const defaultTypeDefs = `
    type Query {
      foo: String
    }
  `;
  const defaultResolvers = {
    Query: {}
  };

  const schema = makeExecutableSchema({
    typeDefs: typeDefs || defaultTypeDefs,
    resolvers: resolvers || defaultResolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  return new SchemaLink({ schema });
};

// eslint-disable-next-line import/prefer-default-export
export { createHttpLink };
