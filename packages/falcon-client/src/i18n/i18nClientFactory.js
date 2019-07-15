import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

const loadLocale = (url, options, callback) =>
  import(/* webpackChunkName: "i18n/[request]" */ `app-path/build/i18n/${url}`)
    .then(x => callback(x.default, { status: '200' }))
    .catch(e => {
      if (e.code === 'MODULE_NOT_FOUND') {
        console.warn(`Can not load locale '${url}'! Will try to load fallback 'lag/ns.json'`);
      } else {
        console.warn(`Unexpected Error while loading locale '${url}'!\n${e}`);
      }
      callback(null, { status: '404' });
    });

export default ({ lng = 'en', fallbackLng = 'en', whitelist = ['en'], debug = false, resources } = {}) =>
  new Promise((resolve, reject) => {
    const defaultNS = 'translations';

    const instance = i18next.use(XHR).init(
      {
        lng,
        ns: [defaultNS],
        fallbackLng,
        whitelist,
        defaultNS,
        fallbackNS: defaultNS,
        saveMissing: false,
        resources,
        debug,
        react: {
          nsMode: 'fallback'
        },
        interpolation: {
          escapeValue: false
        },
        backend: {
          loadPath: '{{lng}}/{{ns}}.json',
          parse: x => x,
          ajax: loadLocale
        }
      },
      error => (error ? reject(error) : resolve(instance))
    );

    if (module.hot) {
      instance.on('initialized', () => {
        instance.reloadResources();
      });
    }
  });
