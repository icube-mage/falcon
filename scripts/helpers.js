const fs = require('fs');
const path = require('path');

module.exports.saveJson = (filePath, json) => {
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
};

module.exports.savePackageJson = json => {
  module.exports.saveJson(path.resolve(__dirname, '../package.json'), json);
};
