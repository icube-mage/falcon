import deepMerge from 'deepmerge';

export default initialConfig =>
  deepMerge(
    {
      logLevel: 'error',
      serverSideRendering: true,
      apolloClient: {
        httpLink: {
          uri: 'http://localhost:4000/graphql',
          useGETForQueries: false
        },
        connectToDevTools: process.env.NODE_ENV !== 'production',
        defaultOptions: {},
        queryDeduplication: true
      },
      googleTagManager: {
        id: null
      },
      i18n: {
        lng: 'en',
        ns: ['common'],
        fallbackLng: 'en',
        whitelist: ['en'],
        // available: languages taken from falcon-server
        debug: false
      }
    },
    initialConfig || {},
    {
      arrayMerge: (destination, source) => source,
      clone: false
    }
  );
