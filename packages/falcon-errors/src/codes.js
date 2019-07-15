const errorCodes = {
  GRAPHQL_PARSE_FAILED: null,
  GRAPHQL_VALIDATION_FAILED: null,
  INTERNAL_SERVER_ERROR: null,
  UNAUTHENTICATED: null,
  NOT_FOUND: null,
  CUSTOMER_TOKEN_NOT_FOUND: null,
  CUSTOMER_TOKEN_EXPIRED: null,
  SESSION_NOT_FOUND: null
};

Object.keys(errorCodes).forEach(key => {
  errorCodes[key] = key;
});

module.exports = errorCodes;
