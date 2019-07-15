import bootstrap from 'app-path/bootstrap';
import defaultConfiguration from './defaultConfiguration';

export default {
  config: defaultConfiguration(bootstrap.config),
  onServerCreated: bootstrap.onServerCreated || (() => {}),
  onServerInitialized: bootstrap.onServerInitialized || (() => {}),
  onServerStarted: bootstrap.onServerStarted || (() => {})
};
