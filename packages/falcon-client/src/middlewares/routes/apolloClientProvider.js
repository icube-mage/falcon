import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import Logger from '@deity/falcon-logger';
import { ApolloClient } from '../../service';

/**
 * Apollo Client Provider middleware, sets ApolloClient on ctx.state.client
 * @param {object} config ApolloClient configuration
 * @param {Object.<string, {defaults, resolvers}>} - dictionary of Apollo States.
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware function
 */
export default ({ config, clientStates = {} }) => {
  const mergedClientState = Object.keys(clientStates).reduce(
    (result, key) => {
      if (clientStates[key]) {
        if (clientStates[key].defaults) {
          result.defaults = { ...result.defaults, ...clientStates[key].defaults };
        }
        if (clientStates[key].resolvers) {
          result.resolvers = { ...result.resolvers, ...clientStates[key].resolvers };
        }
      }

      return result;
    },
    { defaults: {}, resolvers: {} }
  );

  return async (ctx, next) => {
    const { serverTiming } = ctx.state;

    const profileMiddleware = new ApolloLink((operation, forward) => {
      let name = operation.operationName;
      try {
        if (!name) {
          name = operation.query.definitions[0].selectionSet.selections
            .map(item => (item.kind === 'Field' ? item.name.value : ''))
            .join(', ');
        }
      } catch (e) {
        name = '<unknown>';
      }

      const qTimer = serverTiming.start(`> ${operation.query.definitions[0].operation}: ${name}`);
      return forward(operation).map(result => {
        serverTiming.stop(qTimer);
        return result;
      });
    });

    const errorLink = onError(({ networkError, graphQLErrors }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(err => Logger.error(err));
      }

      if (networkError) {
        ctx.response.status = 500;
      }
    });

    const apolloClient = new ApolloClient({
      clientState: mergedClientState,
      extraLinks: [profileMiddleware, errorLink],
      headers: {
        cookie: ctx.get('cookie')
      },
      apolloClientConfig: config
    });

    ctx.state.client = apolloClient;

    return next();
  };
};
