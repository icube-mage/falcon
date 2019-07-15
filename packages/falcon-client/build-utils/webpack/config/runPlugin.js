function runPlugin(plugin, config, options, webpack) {
  if (typeof plugin === 'function') {
    return plugin(config, options, webpack);
  }

  if (typeof plugin.func === 'function') {
    // Used for writing plugin tests
    return plugin.func(config, options, webpack, plugin.options);
  }

  throw new Error(`Unable to run plugin`);
}

module.exports = runPlugin;
