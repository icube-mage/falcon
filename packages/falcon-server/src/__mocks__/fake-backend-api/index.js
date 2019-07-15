const { EndpointManager } = require('@deity/falcon-server-env');

module.exports = class FakeBackendApi extends EndpointManager {
  getEntries() {
    return [
      {
        path: '/info',
        methods: ['get'],
        handler: (ctx, next) => {
          ctx.body = 'foo';
          next();
        }
      }
    ];
  }
};
