const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const AssetsPlugin = require('assets-webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const FalconI18nLocalesPlugin = require('@deity/falcon-i18n-webpack-plugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const LoadablePlugin = require('@loadable/webpack-plugin');

const { colors } = require('./../tools');
const { getClientEnv } = require('./env');
const runPlugin = require('./runPlugin');

const falconClientPolyfills = require.resolve('./../../polyfills');

function getEsLintLoaderOptions(eslintRcPath, isDev) {
  const options = {
    eslintPath: require.resolve('eslint'),
    formatter: require('react-dev-utils/eslintFormatter'),
    ignore: false,
    useEslintrc: fs.existsSync(eslintRcPath),
    emitWarning: isDev
  };

  if (options.useEslintrc === false) {
    options.baseConfig = {
      extends: [require.resolve('@deity/eslint-config-falcon')]
    };
  }

  return options;
}

function getBabelLoaderOptions(babelRcPath) {
  const options = {
    babelrc: true,
    cacheDirectory: true,
    presets: []
  };

  const hasBabelRc = fs.existsSync(babelRcPath);
  if (!hasBabelRc) {
    options.presets.push(require.resolve('@deity/babel-preset-falcon-client'));
  }

  return options;
}

function getStyleLoaders(target, env, cssLoaderOptions) {
  const { sourceMap = false } = cssLoaderOptions;

  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use a plugin to extract that CSS to a file, but
  // in development "style" loader enables hot editing of CSS.
  //
  // Note: this yields the exact same CSS config as create-react-app.

  if (target === 'node') {
    // Style-loader does not work in Node.js without some crazy magic. Luckily we just need css-loader.
    return [
      {
        loader: require.resolve('css-loader/locals'),
        options: {
          ...cssLoaderOptions,
          minimize: false
        }
      }
    ];
  }

  return [
    env === 'production' ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: { ...cssLoaderOptions }
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: { flexbox: 'no-2009' },
            stage: 3
          })
        ],
        sourceMap
      }
    }
  ];
}

function addVendorsBundle(modules = []) {
  const moduleFilter = new RegExp(
    `[\\\\/]node_modules[\\\\/](${modules.map(x => x.replace('/', '[\\\\/]')).join('|')})[\\\\/]`
  );

  return (config, { target, dev }) => {
    if (target === 'web') {
      config.output.filename = dev ? 'static/js/[name].js' : 'static/js/[name].[hash:8].js';

      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              name: 'vendors',
              enforce: true,
              chunks: 'initial',
              test: moduleFilter
            }
          }
        }
      };
    }
  };
}

/**
 * Webpack configuration factory. It's the juice!
 * @param {'web' | 'node' } target target
 * @param {{ env: ('development' | 'production'), host: string, port: number, inspect: string, publicPath: string }} options environment
 * @param {object} buildConfig config
 * @returns {object} webpack config
 */
module.exports = (target = 'web', options, buildConfig) => {
  const { env, host, devServerPort, paths } = options;
  const { useWebmanifest, plugins, modify, i18n } = buildConfig;

  // Define some useful shorthands.
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_PROD = env === 'production';
  const IS_DEV = env === 'development';
  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';
  const devtool = 'cheap-module-source-map';

  const clientEnv = getClientEnv(target, options, buildConfig.envToBuildIn);

  let config = {
    mode: IS_DEV ? 'development' : 'production',
    context: process.cwd(), // Set webpack context to the current command's directory
    target,
    devtool,
    // webpack needs to known how to resolve both falcon-client's and the app's node_modules, so we use resolve and resolveLoader.
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(paths.nodePath.split(path.delimiter).filter(Boolean)),
      extensions: ['.mjs', '.jsx', '.js', '.json', '.graphql', '.gql'],
      alias: {
        'webpack/hot/poll': require.resolve('webpack/hot/poll'), // This is required so symlinks work during development.
        // Support React Native Web https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        src: paths.appSrc,
        'app-path': paths.appPath,
        'app-webmanifest': useWebmanifest ? paths.appWebmanifest : paths.ownWebmanifest
      }
    },
    resolveLoader: { modules: [paths.appNodeModules, paths.ownNodeModules] },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        // { parser: { requireEnsure: false } },
        {
          enforce: 'pre',
          test: /\.(js|jsx|mjs)$/,
          include: paths.appSrc,
          use: [
            {
              loader: require.resolve('eslint-loader'),
              options: getEsLintLoaderOptions(paths.appEslintRc, IS_DEV)
            }
          ]
        },
        // Avoid "require is not defined" errors
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: [paths.appSrc, paths.ownSrc],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: getBabelLoaderOptions(paths.appBabelRc)
            }
          ]
        },
        {
          test: /\.(graphql|gql)$/,
          include: [paths.appSrc, paths.ownSrc],
          use: [{ loader: require.resolve('graphql-tag/loader') }]
        },
        {
          exclude: [
            /\.(js|jsx|mjs)$/,
            /\.(ts|tsx)$/,
            /\.(graphql|gql)$/,
            /\.(less)$/,
            /\.(css|scss|sass)$/,
            /\.json$/,
            /\.html$/,
            /\.(vue)$/,
            /\.(re)$/,
            /\.(webmanifest|browserconfig)$/
          ],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
            emitFile: IS_WEB
          }
        },
        IS_WEB && {
          test: /(manifest\.webmanifest|browserconfig\.xml)$/,
          include: [paths.appSrc],
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/[name].[hash:8].[ext]',
                emitFile: useWebmanifest
              }
            },
            { loader: require.resolve('app-manifest-loader') }
          ]
        },
        {
          test: /\.css$/,
          exclude: [paths.appBuild, /\.module\.css$/],
          use: getStyleLoaders(target, env, {
            importLoaders: 1,
            modules: false,
            minimize: IS_PROD,
            sourceMap: !!devtool
          }),
          sideEffects: true // remove this when webpack adds a warning / error for this. See https://github.com/webpack/webpack/issues/6571
        },
        {
          test: /\.module\.css$/,
          exclude: [paths.appBuild],
          use: getStyleLoaders(target, env, {
            importLoaders: 1,
            modules: true,
            minimize: IS_PROD,
            getLocalIdent: getCSSModuleLocalIdent,
            sourceMap: !!devtool
          }),
          sideEffects: true // remove this when webpack adds a warning / error for this. See https://github.com/webpack/webpack/issues/6571
        },
        {
          test: /\.(scss|sass)$/,
          exclude: /\.module\.(scss|sass)$/,
          use: [
            ...getStyleLoaders(target, env, {
              importLoaders: 2,
              modules: false,
              minimize: IS_PROD,
              sourceMap: !!devtool
            }),
            IS_WEB && require.resolve('sass-loader')
          ].filter(x => x),
          sideEffects: true // remove this when webpack adds a warning / error for this. See https://github.com/webpack/webpack/issues/6571
        },
        {
          test: /\.module\.(scss|sass)$/,
          use: [
            ...getStyleLoaders(target, env, {
              importLoaders: 2,
              modules: true,
              minimize: IS_PROD,
              getLocalIdent: getCSSModuleLocalIdent,
              sourceMap: !!devtool
            }),
            IS_WEB && require.resolve('sass-loader')
          ].filter(x => x),
          sideEffects: true // remove this when webpack adds a warning / error for this. See https://github.com/webpack/webpack/issues/6571
        }
      ].filter(x => x)
    }
  };

  if (IS_NODE) {
    // We want to uphold node's __filename, and __dirname.
    config.node = {
      __console: false,
      __dirname: false,
      __filename: false
    };

    // We need to tell webpack what to bundle into our Node bundle.
    config.externals = [
      nodeExternals({
        whitelist: [
          IS_DEV ? 'webpack/hot/poll?300' : null,
          /@deity\/falcon-client\//, // webpack needs to compile @deity/falcon-client
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/
        ].filter(x => x)
      })
    ];

    config.output = {
      path: paths.appBuild,
      publicPath: IS_DEV ? `http://${host}:${devServerPort}/` : '/',
      filename: 'server.js',
      libraryTarget: 'commonjs2'
    };

    config.plugins = [
      new webpack.DefinePlugin(clientEnv.stringified),
      // Prevent creating multiple chunks for the server
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
    ];

    config.entry = [paths.ownServerIndexJs];

    if (IS_DEV) {
      config.watch = true;
      config.entry.unshift('webpack/hot/poll?300');

      // Pretty format server errors
      config.entry.unshift('razzle-dev-utils/prettyNodeErrors');
      config.plugins = [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin(),
        // Suppress errors to console (we use our own logger)
        new StartServerPlugin({
          name: 'server.js',
          nodeArgs: ['-r', 'source-map-support/register', options.inspect].filter(x => x)
        }),
        // Ignore assets.json to avoid infinite recompile bug
        new webpack.WatchIgnorePlugin([paths.appManifest])
      ];
    }
  }

  if (IS_WEB) {
    config.plugins = [
      new VirtualModulesPlugin({ [paths.ownWebmanifest]: '{}' }),
      new FalconI18nLocalesPlugin({
        mainSource: path.join(paths.appPath, 'i18n'),
        defaultSources: (i18n.resourcePackages || []).map(x => path.join(paths.resolvePackageDir(x), 'i18n')),
        output: 'build/i18n',
        filter: i18n.filter || {}
      }),
      new AssetsPlugin({
        path: paths.appBuild,
        filename: 'assets.json',
        includeAllFileTypes: true,
        prettyPrint: true
      }),
      new LoadablePlugin({
        outputAsset: false,
        writeToDisk: { filename: paths.appBuild }
      })
    ];

    if (IS_DEV) {
      // Setup Webpack Dev Server on port 3001 and
      // specify our client entry point /client/index.js
      config.entry = {
        client: [
          // We ship a few polyfills by default but only include them if React is being placed in the default path.
          !clientEnv.raw.REACT_BUNDLE_PATH && falconClientPolyfills,
          require.resolve('razzle-dev-utils/webpackHotDevClient'),
          paths.ownClientIndexJs
        ].filter(Boolean)
      };

      // Configure our client bundles output. Not the public path is to 3001.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: `http://${host}:${devServerPort}/`,
        pathinfo: true,
        libraryTarget: 'var',
        filename: 'static/js/bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => path.resolve(info.resourcePath).replace(/\\/g, '/')
      };
      // Configure webpack-dev-server to serve our client-side bundle from
      // http://${dotenv.raw.HOST}:3001
      config.devServer = {
        disableHostCheck: true,
        clientLogLevel: 'none',
        // Enable gzip compression of generated files.
        compress: true,
        // watchContentBase: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
          // Paths with dots should still use the history fallback. See https://github.com/facebookincubator/create-react-app/issues/387.
          disableDotRule: true
        },
        host,
        hot: true,
        noInfo: true,
        overlay: false,
        port: devServerPort,
        quiet: true,
        // By default files from `contentBase` will not trigger a page reload.
        // Reportedly, this avoids CPU overload on some systems. https://github.com/facebookincubator/create-react-app/issues/293
        watchOptions: {
          ignored: /node_modules/
        },
        before(app) {
          // This lets us open files from the runtime error overlay.
          app.use(errorOverlayMiddleware());
        }
      };
      // Add client-only development plugins
      config.plugins = [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin({ multiStep: true }),
        new webpack.DefinePlugin(clientEnv.stringified)
      ];

      config.optimization = {};
    } else {
      // Specify production entry point (/client/index.js)
      config.entry = {
        client: [
          // We ship a few polyfills by default but only include them if React is being placed in the default path.
          // If you are doing some vendor bundling, you'll need to require the @deity/falcon-client/build-utils/polyfills on your own.
          !clientEnv.raw.REACT_BUNDLE_PATH && falconClientPolyfills,
          paths.ownClientIndexJs
        ].filter(Boolean)
      };

      // Specify the client output directory and paths. Notice that we have
      // changed the publiPath to just '/' from http://localhost:3001. This is because
      // we will only be using one port in production.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: options.publicPath,
        filename: 'static/js/bundle.[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        libraryTarget: 'var'
      };

      config.plugins = [
        ...config.plugins,
        new webpack.DefinePlugin(clientEnv.stringified),
        // Extract our CSS into a files.
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
      ];

      if (options.analyze) {
        config.plugins.push(new BundleAnalyzerPlugin());
      }

      config.optimization = {
        minimize: true,
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              parse: {
                // we want uglify-js to parse ecma 8 code. However, we don't want it
                // to apply any minfication steps that turns valid ecma 5 code
                // into invalid ecma 5 code. This is why the 'compress' and 'output'
                // sections only apply transformations that are ecma 5 safe
                // https://github.com/facebook/create-react-app/pull/4234
                ecma: 8
              },
              compress: {
                ecma: 5,
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebook/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false
              },
              mangle: {
                safari10: true
              },
              output: {
                ecma: 5,
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebook/create-react-app/issues/2488
                ascii_only: true
              }
            },
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            cache: true, // Enable file caching
            sourceMap: !!devtool
          })
        ]
      };
    }
  }

  config.plugins = [
    ...config.plugins,
    new WebpackBar({
      minimal: options.isCI,
      color: colors.deityGreen,
      name: IS_WEB ? 'client' : 'server',
      compiledIn: true
    })
  ];

  addVendorsBundle([
    'apollo-cache-inmemory',
    'apollo-client',
    'apollo-link',
    'apollo-link-http',
    'apollo-link-state',
    'apollo-utilities',
    'node-fetch',
    'i18next',
    'i18next-xhr-backend',
    '@deity/falcon-client/build-utils/polyfills',
    'react',
    'react-apollo',
    'react-dom',
    'react-google-tag-manager',
    `react-helmet`,
    'react-router',
    'react-router-dom',
    'history'
  ])(config, { target, dev: IS_DEV });

  // Apply razzle plugins, if they are present in razzle.config.js
  if (Array.isArray(plugins)) {
    plugins.forEach(plugin => {
      config = runPlugin(plugin, config, { ...options, target, dev: IS_DEV }, webpack);
    });
  }

  // Check if razzle.config has a modify function. If it does, call it on the
  // configs we created.
  if (modify) {
    config = modify(config, { ...options, target, dev: IS_DEV }, webpack);
  }

  return config;
};
