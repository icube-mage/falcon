const config = require('config');

module.exports = {
  devServerPort: (config.port || 3000) + 1,
  clearConsole: false,
  useWebmanifest: true,
  i18n: {
    resourcePackages: ['@deity/falcon-i18n']
  },
  moduleOverride: {
    // '@deity/falcon-ecommerce-uikit/dist/Countries/CountriesQuery': './src/components/Countries/CountriesQuery'
    '@deity/falcon-ui/dist/components/Input': './src/components/FalconUi/components/Input',
    '@deity/falcon-ui/dist/components/Select': './src/components/FalconUi/components/Select'
  }
};
