const { startDevServer, build, size } = require('./webpack');
const jest = require('./jest');

module.exports = {
  start: startDevServer,
  build,
  size,
  test: jest
};
