import i18next from 'i18next';
import Backend from 'i18next-sync-fs-backend';

/**
 * @typedef {object} Options
 * @property {string} lng - language
 * @property {string} fallbackLng fallback language
 * @property {string[]} whitelist languages whitelist
 * @property {object} resources Initial internationalization resources
 */

/**
 * i18next instance server side factory
 * @argument {Options} options - options
 * @returns {Promise<i18next.i18n>} - Promise with initialized i18n instance
 */
export default ({ lng = 'en', fallbackLng = 'en', whitelist = ['en'], debug = false, resources } = {}) =>
  new Promise((resolve, reject) => {
    const defaultNS = 'translations';

    const instance = i18next.use(Backend);
    instance.init(
      {
        lng,
        ns: [defaultNS],
        fallbackLng,
        whitelist,
        defaultNS,
        fallbackNS: defaultNS,
        saveMissing: false,
        initImmediate: false,
        resources,
        debug,
        react: {
          wait: true,
          nsMode: 'fallback'
        },
        interpolation: {
          escapeValue: false
        },
        backend: {
          loadPath: 'build/i18n/{{lng}}/{{ns}}.json',
          jsonIndent: 2
        }
      },
      error => (error ? reject(error) : resolve(instance))
    );
  });

export function extractI18nextState(ctx) {
  if (ctx.i18next) {
    return {
      language: ctx.i18next.language
    };
  }

  return {};
}
