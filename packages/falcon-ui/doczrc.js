import * as path from 'path';
import fs from 'fs';
import { createPlugin } from 'docz-core';

const doczPluginNetlify = () =>
  createPlugin({
    onPostBuild: config => {
      fs.writeFileSync(`./${config.dest}/_redirects`, '/*    /index.html   200', { encoding: 'utf8' });
    }
  });

// always  build docz in development version in order to have 'component finder working'
// as it only works in react development mode
process.env.NODE_ENV = 'development';
export default {
  typescript: true,
  propsParser: false,
  src: './src',
  wrapper: 'docs/Wrapper',
  title: 'Falcon UI',
  description: 'Library of composable, themable, design-system-driven UI components for React',
  repository: 'https://github.com/deity-io/falcon/tree/master/packages/falcon-ui',
  themeConfig: {
    styles: {
      h1: {
        fontSize: 48,
        fontWeight: 300,
        margin: '32px 0',
        letterSpacing: 0,
        '::before': {
          display: 'none'
        }
      },
      h2: {
        fontSize: 39,
        fontWeight: 400,
        letterSpacing: 0,
        '::before': {
          display: 'none'
        }
      }
    }
  },

  modifyBundlerConfig: config => {
    config.mode = 'development';

    config.resolve.alias = Object.assign({}, config.resolve.alias, {
      '@deity/falcon-ui': path.resolve(__dirname, 'src'),
      docs: path.resolve(__dirname, 'docs')
    });

    return config;
  },
  plugins: [doczPluginNetlify()]
};
