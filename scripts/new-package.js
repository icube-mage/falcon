const chalk = require('chalk');
const program = require('commander');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const { saveJson, savePackageJson } = require('./helpers');

program
  .version(pkg.version)
  .arguments('<package-name>')
  .usage('<package-name>')
  .action(async name => {
    const packageName = `@deity/${name}`;
    const workspaceName = `packages/${name}`;
    const packageFolder = path.resolve(__dirname, '..', workspaceName);

    if (pkg.workspaces.includes(workspaceName)) {
      console.log(chalk.red(`"${workspaceName}" already defined.`));
      return;
    }

    pkg.workspaces.push(workspaceName);
    savePackageJson(pkg);

    fs.mkdirSync(packageFolder);

    const newPackageJson = {
      name: packageName,
      license: 'OSL-3.0',
      main: 'index.js',
      version: '0.0.1',
      repository: `https://github.com/deity-io/falcon/tree/master/${workspaceName}`
    };

    saveJson(path.resolve(packageFolder, 'package.json'), newPackageJson);

    console.log(
      `${chalk.green(packageName)} package structure has been generated \nin ${chalk.green(packageFolder)} folder`
    );
  })
  .parse(process.argv);
