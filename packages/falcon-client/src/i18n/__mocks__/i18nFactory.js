import i18next from 'i18next';

export default ({ lng = 'en', fallbackLng = 'en', whitelist = ['en'], debug = false, resources } = {}) => {
  const defaultNS = 'common';

  return i18next.init({
    lng,
    whitelist,
    fallbackLng,
    defaultNS,
    fallbackNS: defaultNS,
    debug,
    resources,
    react: {
      nsMode: 'fallback'
    },
    interpolation: {
      escapeValue: false
    }
  });
};
