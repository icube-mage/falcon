const fs = require('fs-extra');
const babelJest = require('babel-jest');
const paths = require('./../../paths');

const hasBabelRc = fs.existsSync(paths.appBabelRc);

const config = {
  presets: !hasBabelRc && [require.resolve('@deity/babel-preset-falcon-client')],
  babelrc: !!hasBabelRc
};

module.exports = babelJest.createTransformer(config);
