const workbox = require('workbox-build');
const Logger = require('@deity/falcon-logger');
const path = require('path');
const paths = require('../paths');
const { formatBytes } = require('./tools');

module.exports.generateSW = async () => {
  const swLocation = path.join('build', 'public', 'sw.js');
  try {
    const configuration = {
      swSrc: path.join(paths.ownSrc, 'serviceWorker/sw.js'),
      swDest: path.join(paths.appPath, swLocation),
      maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8MB
      globDirectory: '.',
      globPatterns: ['build/public/**/*.{js,json,html,css,ico,png,jpg,gif,svg,eot,ttf,woff,woff2}'],
      modifyUrlPrefix: {
        'build/public': ''
      },
      templatedUrls: {
        '/app-shell': ['build/public/static/@(js|css)/@(client|vendor|bundle)*.@(js|css)', 'build/server.js']
      },
      dontCacheBustUrlsMatching: /\/static\/.*/
    };

    const { count, size, warnings } = await workbox.injectManifest(configuration);
    Logger.log(
      `Generated Service Worker ${swLocation} which will precache ${count} files, totaling ${formatBytes(size)}.\n`
    );
    if (warnings.length) {
      Logger.warn(warnings.join('\n'));
    }
  } catch (error) {
    Logger.error('Service Worker generation failed!');

    throw error;
  }
};
