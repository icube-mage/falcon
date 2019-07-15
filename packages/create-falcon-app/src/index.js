const { dirname, resolve } = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const Listr = require('listr');
const http = require('http');

const examplesPath = resolve(__dirname, './../examples');
const rootDir = resolve(__dirname, './../../..');
const rootPackage = resolve(rootDir, 'package.json');

const getAvailableExamples = () => {
  try {
    return fs.readdirSync(examplesPath).filter(entry => fs.lstatSync(resolve(examplesPath, entry)).isDirectory());
  } catch (e) {
    return [];
  }
};

const copyFolder = (source, dest) => {
  fs.copySync(source, dest, {
    filter: src => !src.replace(source, '').match(/.*\/(node_modules|coverage|build).*/g)
  });
};

const getPackageManager = () => {
  try {
    execa.sync('yarnpkg', '--version');
    return 'yarn';
  } catch (e) {
    return 'npm';
  }
};

const getActiveProjects = targetPath => {
  const folders = [];

  if (fs.existsSync(resolve(targetPath, 'package.json'))) {
    folders.push(targetPath);
  } else {
    const entries = fs
      .readdirSync(targetPath)
      .map(folder => resolve(targetPath, folder))
      .filter(entry => fs.lstatSync(entry).isDirectory());

    folders.push(...entries);
  }

  return folders;
};

const replaceNightlyVersion = () => {
  const { workspaces } = fs.readJSONSync(rootPackage);
  const nightlyVersionMap = new Map();

  // Getting the actual package versions
  workspaces.forEach(workspace => {
    if (!workspace.startsWith('packages/')) {
      return;
    }

    const packagePath = resolve(rootDir, workspace, 'package.json');
    const { name, version } = fs.readJSONSync(packagePath);
    nightlyVersionMap.set(name, version);
  });

  // Re-writing nightly versions for all available examples
  getAvailableExamples().forEach(example => {
    getActiveProjects(resolve(examplesPath, example)).forEach(exampleProject => {
      const examplePackagePath = resolve(exampleProject, 'package.json');
      const examplePackage = fs.readJSONSync(examplePackagePath);

      ['dependencies', 'devDependencies'].forEach(depKey => {
        nightlyVersionMap.forEach((packageVer, packageName) => {
          if (packageName in examplePackage[depKey]) {
            examplePackage[depKey][packageName] = packageVer;
          }
        });
      });

      fs.writeJSONSync(examplePackagePath, examplePackage, {
        spaces: 2
      });
    });
  });
};

const createFalconApp = ({ name, example }) => {
  const targetPath = resolve(process.cwd(), name);
  const baseProjectPath = `${dirname(targetPath)}/`;

  const templatePath = resolve(examplesPath, example || 'shop-with-blog');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`"${templatePath}" template does not exist.`);
  }
  if (fs.existsSync(targetPath)) {
    throw new Error(`"${targetPath}" exists`);
  }

  const tasks = new Listr([
    {
      title: `Generating base structure for ${name} App`,
      task: () => fs.copySync(templatePath, targetPath)
    },
    {
      title: 'Installing dependencies',
      task: ctx => {
        const subTasks = [];
        ctx.packageManager = getPackageManager();
        ctx.activeProjects = getActiveProjects(targetPath);

        ctx.activeProjects.forEach(folder => {
          subTasks.push({
            title: `for ${folder.replace(baseProjectPath, '')}`,
            task: () => execa(ctx.packageManager, ['install'], { cwd: folder })
          });
        });

        return new Listr(subTasks, { concurrent: true });
      }
    }
  ]);

  return tasks.run();
};

const track = (() => {
  const { machineIdSync } = require('node-machine-id');
  const os = require('os');
  const ua = `${os.type()} ${os.release()} ${os.platform()}, node@${process.version}`;
  let id;
  let enabled = true;

  try {
    id = machineIdSync();
  } catch (ex) {
    id = 'unknown';
  }

  const trackEvent = (category, action, label, value) => {
    if (!enabled) {
      return;
    }

    const data = ['v=1', 'tid=UA-115774797-7', `cid=${id}`, 't=event', `ec=${category}`, `ea=${action}`];
    if (label) {
      data.push(`el=${label}`);
    }
    if (value) {
      data.push(`ev=${value}`);
    }

    const options = {
      host: 'www.google-analytics.com',
      path: '/collect',
      method: 'POST',
      headers: {
        'User-Agent': ua
      }
    };

    const req = http.request(options);
    req.write(data.join('&'));
    req.end();
  };

  trackEvent.enable = value => {
    enabled = value;
  };

  return trackEvent;
})();

module.exports = createFalconApp;
module.exports.replaceNightlyVersion = replaceNightlyVersion;
module.exports.copyFolder = copyFolder;
module.exports.examplesPath = examplesPath;
module.exports.getAvailableExamples = getAvailableExamples;
module.exports.track = track;
