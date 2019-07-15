module.exports = (/* api */) => {
  const preset = {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: false
        }
      ],
      require.resolve('@babel/preset-react')
    ],
    plugins: [
      // class { handleThing = () => { } }
      require.resolve('@babel/plugin-proposal-class-properties'),

      // The following two plugins use Object.assign directly, instead of Babel's
      // extends helper. Note that this assumes `Object.assign` is available.
      // { ...todo, completed: true }
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        {
          useBuiltIns: true
        }
      ],
      // Adds syntax support for import()
      require.resolve('babel-plugin-syntax-dynamic-import'),
      // Add support for async/await
      require.resolve('@babel/plugin-transform-runtime'),
      // Add support for loadable components SSR
      // https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/
      require.resolve('@loadable/babel-plugin'),
      require.resolve('babel-plugin-graphql-tag')
    ]
  };

  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env !== 'development' && env !== 'test' && env !== 'production') {
    throw new Error(
      `${'Using `babel-preset-falcon-client` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: '}${JSON.stringify(env)}.`
    );
  }

  if (env === 'development' || env === 'test') {
    preset.plugins = [
      ...preset.plugins,
      // Adds component stack to warning messages
      require.resolve('@babel/plugin-transform-react-jsx-source')
    ];
  }

  if (env === 'test') {
    preset.plugins = [
      ...preset.plugins,
      // Compiles import() to a deferred require()
      require.resolve('babel-plugin-dynamic-import-node'),
      // Transform ES modules to commonjs for Jest support
      [require.resolve('@babel/plugin-transform-modules-commonjs'), { loose: true }]
    ];
  }

  if (env === 'production') {
    preset.plugins = [...preset.plugins, require.resolve('babel-plugin-transform-react-remove-prop-types')];
  }

  return preset;
};
