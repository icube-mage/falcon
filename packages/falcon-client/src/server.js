import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import compress from 'koa-compress';
import Logger from '@deity/falcon-logger';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';
import { renderAppShell, renderApp } from './middlewares/routes';

/**
 * Creates an instance of Falcon web server
 * @param {ServerAppConfig} props Application parameters
 * @return {WebServer} Falcon web server
 */
export function Server({ App, clientApolloSchema, bootstrap, webpackAssets, loadableStats }) {
  const { config } = bootstrap;
  Logger.setLogLevel(config.logLevel);

  const instance = new Koa();
  bootstrap.onServerCreated(instance);

  const publicDir = process.env.PUBLIC_DIR;
  const router = new Router();
  router.get('/sw.js', serve(publicDir, { maxage: 0 }));
  router.get('/static/*', serve(publicDir, { maxage: process.env.NODE_ENV === 'production' ? 31536000000 : 0 }));
  router.get('/*', serve(publicDir));
  router.get('/app-shell', ...renderAppShell({ config, webpackAssets, loadableStats }));
  router.get('/*', ...renderApp({ App, clientApolloSchema, config, webpackAssets, loadableStats }));

  instance
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods());

  bootstrap.onServerInitialized(instance);

  return {
    instance,
    callback: () => instance.callback(),
    started: () => bootstrap.onServerStarted(instance)
  };
}

/**
 * @typedef {object} ServerAppConfig
 * @property {function} App Root application component
 * @property {{config, onServerCreated, onServerInitialized, onServerStarted }} bootstrap Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} webpackAssets webpack assets
 */

/**
 * @typedef {object} WebServer
 * @property {Koa} instance Server instance
 * @property {function} callback Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 */
