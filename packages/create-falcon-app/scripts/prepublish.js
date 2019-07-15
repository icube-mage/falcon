const { resolve } = require('path');
const { emptyDirSync } = require('fs-extra');
const { copyFolder, examplesPath, replaceNightlyVersion } = require('../src');

const examplesSourcePath = resolve(__dirname, '../../../examples');

emptyDirSync(examplesPath);
copyFolder(examplesSourcePath, examplesPath);

if (process.env.NIGHTLY_BUILD) {
  replaceNightlyVersion();
}
