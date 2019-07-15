import koaI18next from 'koa-i18next';
import i18nFactory from '../../i18n/i18nServerFactory';
import { GET_BACKEND_CONFIG } from '../../graphql/config.gql';

/**
 * @typedef {object} Options
 * @property {string} lng - language
 * @property {string[]} ns - namespaces to load
 * @property {string} fallbackLng fallback language
 * @property {string[]} whitelist languages whitelist
 * @property {object} resources Initial internationalization resources
 */

/**
 * i18next instance server side factory
 * @argument {Options} options - options
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default options => async (ctx, next) => {
  const { client } = ctx.state;
  const {
    data: { backendConfig }
  } = await client.query({ query: GET_BACKEND_CONFIG });

  const i18nInstance = await i18nFactory({ ...options, lng: backendConfig.activeLocale });

  return koaI18next(i18nInstance, {
    lookupCookie: 'i18n',
    order: ['cookie'],
    next: true // because of koa v2
  })(ctx, next);
};
