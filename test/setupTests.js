// eslint-disable-next-line import/no-extraneous-dependencies
const { configure: configureEnzyme } = require('enzyme');
// eslint-disable-next-line import/no-extraneous-dependencies
const Adapter = require('enzyme-adapter-react-16');

configureEnzyme({ adapter: new Adapter() });
