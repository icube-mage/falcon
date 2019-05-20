const config = require('config');

module.exports = {
  devServerPort: (config.port || 3000) + 1,
  clearConsole: false,
  useWebmanifest: true,
  i18n: {
    resourcePackages: ['@deity/falcon-i18n']
  },
  moduleOverride: {}
};
