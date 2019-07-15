import apolloClientProvider from './apolloClientProvider';
import ssr from './ssrMiddleware';
import appShell from './appShellMiddleware';
import appHtml from './appHtmlMiddleware';
import i18next from './i18nextMiddleware';

/**
 * @typedef {object} RenderAppShell
 * @property {object} config App configuration
 * @property {object} webpackAssets webpack assets
 * @property {object} loadableStats @loadable components stats
 */

/**
 * Configure App Shell rendering middlewares
 * @param {RenderAppShell} params params
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderAppShell({ config, webpackAssets, loadableStats }) {
  const { apolloClient } = config;
  const configSchema = { defaults: { config } };

  return [
    apolloClientProvider({ config: apolloClient, clientStates: { configSchema } }),
    appShell({ loadableStats }),
    appHtml({ webpackAssets })
  ];
}

/**
 * @typedef {object} RenderApp
 * @property {function} App React Component
 * @property {object} config App configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} webpackAssets webpack assets,
 * @property {object} loadableStats @loadable components stats
 */

/**
 * Configure App rendering middlewares
 * @param {RenderApp} params params
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderApp({ config, clientApolloSchema, App, webpackAssets, loadableStats }) {
  const { i18n, serverSideRendering, apolloClient } = config;
  const configSchema = { defaults: { config } };

  return [
    apolloClientProvider({
      config: apolloClient,
      clientStates: {
        configSchema,
        clientApolloSchema
      }
    }),
    i18next({ ...i18n }),
    serverSideRendering ? ssr({ App, loadableStats }) : appShell({ loadableStats }),
    appHtml({ webpackAssets })
  ].filter(x => x);
}
