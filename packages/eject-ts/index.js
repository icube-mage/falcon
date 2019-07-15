/* eslint-disable no-use-before-define, import/no-dynamic-require */

const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const chalk = require('chalk');
const babel = require('@babel/core');
const recast = require('recast');
const prettier = require('prettier');
const install = require('install-packages');

// as an improvement those options could be provided via command line perhaps
const prettierOptions = {
  tabWidth: 2,
  singleQuote: true,
  printWidth: 120,
  parser: 'babylon',
  endOfLine: 'lf'
};

module.exports = {
  eject
};

async function eject(packageToEject, targetDir) {
  if (!packageToEject) {
    console.log(chalk.red(`Please, provide package to eject arg`));
    return;
  }

  if (!targetDir) {
    console.log(chalk.red(`Please, provide target dir where package will be ejected`));
    return;
  }

  const targetDirFullPath = path.join(process.cwd(), targetDir);
  const appSrc = path.join(process.cwd(), 'src');
  // assumption is that resolvedPackageDir points to dist folder that is one level deep inside root package dir
  // and based on that assumption we can retreive package json and src dir
  const resolvedPackageDir = path.dirname(require.resolve(packageToEject));
  const resolvedPackagePackageJsonPath = path.join(resolvedPackageDir, '../package.json');
  const resolvedPackagePackageJsonDependencies = require(resolvedPackagePackageJsonPath).dependencies;
  const packageSrcFiles = path.join(resolvedPackageDir, '../src');

  console.log(chalk.green(`Ejecting ${bold(packageToEject)} package into ${bold(targetDirFullPath)} ...`));

  // don't run any further if targetDir already exists, we don't want to overwrite anything
  if (fs.pathExistsSync(targetDirFullPath)) {
    console.log(
      chalk.red(
        `Looks like ${bold(packageToEject)} has been already ejected because ${bold(targetDir)} dir already exists.`
      )
    );

    return;
  }

  // copy source typescript files to target dir
  fs.copySync(packageSrcFiles, targetDirFullPath, { filter: filterOnlyTSSourceFiles });

  // retreive all copied TS files metadata
  const ejectedFilesMeta = klawSync(targetDirFullPath, { nodir: true });
  // once files are copied then we transform each of them by removing TS types
  // while preserving original formatting and changing extension to .js
  convertToJs(ejectedFilesMeta);

  // retreive all project  files that can have imports to package being ejected
  const appFilesMeta = klawSync(appSrc, { nodir: true, filter: filterOnlyAppJsFiles(targetDir) });

  // and then replace imports inside them
  replaceImports(appFilesMeta, packageToEject, targetDir);

  // as a final step install dependencies of package being ejected to project where it's ejected
  // this logic fails when using yarn workspaces - https://github.com/yarnpkg/yarn/issues/4812
  const dependenciesToInstall = Object.keys(resolvedPackagePackageJsonDependencies).map(
    packageName => `${packageName}@${resolvedPackagePackageJsonDependencies[packageName]}`
  );

  console.log(chalk.green(`Installing dependencies of ${bold(packageToEject)} package in the project...`));

  try {
    await install({
      packages: dependenciesToInstall,
      peerFilter: () => false
    });
  } catch (_ignored) {
    console.log(
      chalk.green(
        `
         It appears that you've run eject command while using yarn workspaces in your project,
         hence intallation failed due to known yarn issue (https://github.com/yarnpkg/yarn/issues/4812).
         Package has been ejected, but if you'd have troubles running the project after it anyway, try running yarn install in the root dir.`
      )
    );
  }

  console.log(chalk.green(`${bold(packageToEject)} package ejected!`));
}

function convertToJs(ejectedFilesMeta) {
  ejectedFilesMeta.forEach(meta => {
    const filePath = meta.path;

    const fileContents = fs.readFileSync(filePath, 'utf8');
    // babel transforms Typescript to JS using recast to preserve as much original formatting as possible
    const result = babel.transformSync(fileContents, {
      plugins: [['@babel/plugin-transform-typescript', { isTSX: true }], pluginRecast]
    });

    // run prettier on transformed JS as recast preserves formatting such as whitespaces, but formats bit diferently thant prettier
    const transformedContents = prettier.format(result.code, prettierOptions);

    // write transformed code to file
    fs.writeFileSync(filePath, normalizeNewLines(transformedContents), 'utf8');

    // finally rename file to .js extension
    const targetPathJs = filePath.replace(path.extname(filePath), '.js');
    fs.moveSync(filePath, targetPathJs);
  });
}

function replaceImports(appFilesMeta, originalImport, replacementImport) {
  appFilesMeta.forEach(meta => {
    const filePath = meta.path;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    // run babel transforms that preserve formatting while replacing imports
    const result = babel.transformSync(fileContents, {
      plugins: [
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-class-properties',
        ['babel-plugin-transform-rename-import', { original: originalImport, replacement: replacementImport }],
        pluginRecast
      ]
    });

    const transformedContents = prettier.format(result.code, prettierOptions);

    fs.writeFileSync(filePath, normalizeNewLines(transformedContents), 'utf8');
  });
}

// recast plugin overrides parser and generator of babel to use recast's ones
// as recast preserves original file formatting much better (new lines, white spaces)
function pluginRecast() {
  return {
    parserOverride(code, opts, parser) {
      return recast.parse(code, {
        ...opts,
        parser: {
          parse: source => parser(source, Object.assign({}, opts, { tokens: true }))
        }
      });
    },
    generatorOverride(ast, opts) {
      return recast.print(ast, opts);
    }
  };
}
// accepts two args (src, dest) - designed to work with fs-extra package:
// https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md
function filterOnlyTSSourceFiles(src) {
  const ext = path.extname(src);

  if (ext && ext !== '.ts' && ext !== '.tsx') return false;
  // skip tests as well
  if (src.indexOf('.test') !== -1) return false;

  return true;
}

// accepts single argument (object with path) - designed to work with klaw package:
// https://github.com/manidlou/node-klaw-sync#klawsyncdirectory-options
function filterOnlyAppJsFiles(targetDir) {
  return item => {
    const ext = path.extname(item.path);

    if (ext && ext !== '.js') return false;

    return item.path.indexOf(targetDir) === -1;
  };
}

function bold(text) {
  return chalk.blue.underline.bold(text);
}

function normalizeNewLines(src) {
  return src.replace(/\r?\n|\r/g, '\n');
}
