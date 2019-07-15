const fs = require('fs');
const path = require('path');

module.exports = paths => {
  let config = {
    rootDir: paths.appPath,
    setupTestFrameworkScriptFile: fs.existsSync(paths.testsSetup) ? '<rootDir>/src/setupTests.js' : undefined,
    testEnvironment: 'node',
    testURL: 'http://localhost',
    testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}', '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}'],
    transform: {
      '^.+\\.(gql|graphql)$': 'jest-transform-graphql',
      '^.+\\.(js|jsx|mjs)$': path.resolve(__dirname, 'babelTransform.js'),
      '^.+\\.css$': path.resolve(__dirname, 'cssTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|css|json)$)': path.resolve(__dirname, 'fileTransform.js')
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
    moduleFileExtensions: ['js', 'jsx', 'json'],
    moduleNameMapper: {
      '^src(.*)$': '<rootDir>/src$1',
      '^react-native$': 'react-native-web'
    },
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,mjs}'],
    coverageReporters: ['html', 'text', 'text-summary', 'lcov']
  };

  // eslint-disable-next-line
  const packageJson = require(paths.appPackageJson);
  if (packageJson.jest) {
    config = {
      ...config,
      ...packageJson.jest
    };
  }

  return config;
};
