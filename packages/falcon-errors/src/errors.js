const codes = require('./codes');

// FalconError is simplified version of ApolloError
// that does not import whole `graphql` package resulting in much smaller bundle size
// https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-errors/src/index.ts
class FalconError extends Error {
  constructor(message, code) {
    super(message);
    // if no name provided, use the default. defineProperty ensures that it stays non-enumerable
    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'FalconError' });
    }

    if (code) {
      Object.defineProperty(this, 'extensions', { value: { code } });
    }
  }
}

module.exports.AuthenticationError = class AuthenticationError extends FalconError {
  constructor(message) {
    super(message, codes.UNAUTHENTICATED);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};

module.exports.EntityNotFoundError = class EntityNotFoundError extends FalconError {
  constructor(message = 'Entity not found') {
    super(message, codes.NOT_FOUND);
    Object.defineProperty(this, 'name', { value: 'EntityNotFoundError' });
  }
};
