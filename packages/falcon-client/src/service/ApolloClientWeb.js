import { CachePersistor } from 'apollo-cache-persist';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from './';

export const apolloClientWeb = ({ initialState, clientApolloSchema, apolloClientConfig }) => {
  const cache = new InMemoryCache({ addTypename: false });
  const cachePersistor = new CachePersistor({
    cache,
    storage: window.localStorage,
    key: '@deity/falcon-client/apollo-cache',
    maxSize: 1048576, // https://github.com/apollographql/apollo-cache-persist/issues/50
    debounce: 1000
  });

  const restoreCache = persistor =>
    window.navigator && window.navigator.onLine
      ? persistor.purge().then(() => cache.restore(initialState))
      : persistor.restore();

  return restoreCache(cachePersistor).then(() => {
    const apolloClient = new ApolloClient({
      isBrowser: true,
      clientState: clientApolloSchema,
      initialState,
      apolloClientConfig,
      cache
    });

    return Promise.resolve(apolloClient);
  });
};
