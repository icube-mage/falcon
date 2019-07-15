const jest = require('jest');

module.exports = () => {
  process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
  process.env.PORT = process.env.PORT || 3000;
  process.env.PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
  process.env.BUILD_TARGET = process.env.BUILD_TARGET || '';
  process.env.ASSETS_MANIFEST = process.env.ASSETS_MANIFEST || 'assets/manifest.json';
  process.env.PUBLIC_DIR = process.env.PUBLIC_DIR || 'public/dir';

  const paths = require('./../paths');
  const createConfig = require('./config/create');
  const config = createConfig(paths);

  const argv = process.argv.slice(2);
  // Watch unless on CI or in coverage mode
  if (!process.env.CI && argv.indexOf('--coverage') < 0) {
    argv.push('--watch');
  }
  argv.push('--config', JSON.stringify(config));

  jest.run(argv);
};
