const { ApiDataSource, Extension, ApiUrlPriority } = require('@deity/falcon-server-env');
const { EventEmitter2 } = require('eventemitter2');
const ExtensionContainer = require('./../containers/ExtensionContainer');
const DynamicRouteResolver = require('./DynamicRouteResolver');

describe('DynamicRouteResolver', () => {
  it('Should correctly resolve DynamicRoute request', async () => {
    const ee = new EventEmitter2();
    const extensionContainer = new ExtensionContainer(ee);
    const Api1 = class extends ApiDataSource {
      getFetchUrlPriority(path) {
        return path.startsWith('/blog/') ? ApiUrlPriority.HIGHEST : ApiUrlPriority.LOW;
      }
      async fetchUrl(_, { path }) {
        return {
          id: 1,
          path,
          type: 'foo'
        };
      }
    };
    const Api2 = class extends ApiDataSource {
      getFetchUrlPriority(path) {
        return path.endsWith('.html') ? ApiUrlPriority.HIGH : ApiUrlPriority.NORMAL;
      }
      async fetchUrl(_, { path }) {
        return {
          id: 2,
          path,
          type: 'bar'
        };
      }
    };

    const Ext1 = class extends Extension {};
    const Ext2 = class extends Extension {};

    const ext1 = new Ext1({ name: 'Ext1', config: { api: 'api1' } });
    const ext2 = new Ext2({ name: 'Ext2', config: { api: 'api2' } });

    const dataSources = {
      api1: new Api1({}),
      api2: new Api2({})
    };

    const spyExt1 = jest.spyOn(ext1, 'fetchUrl');
    const spyExt2 = jest.spyOn(ext2, 'fetchUrl');

    extensionContainer.extensions.set(ext1.name, ext1);
    extensionContainer.extensions.set(ext2.name, ext2);
    const dynamicResolver = new DynamicRouteResolver(extensionContainer);

    const result = await dynamicResolver.fetchUrl({}, { path: 'foo.html' }, { dataSources });
    expect(result).toEqual({ id: 2, path: 'foo.html', type: 'bar' });
    expect(spyExt2).toHaveBeenCalled();
    expect(spyExt1).not.toHaveBeenCalled();

    spyExt1.mockClear();
    spyExt2.mockClear();

    const result2 = await dynamicResolver.fetchUrl({}, { path: '/blog/bar/page' }, { dataSources });
    expect(result2).toEqual({ id: 1, path: '/blog/bar/page', type: 'foo' });
    expect(spyExt1).toHaveBeenCalled();
    expect(spyExt2).not.toHaveBeenCalled();

    spyExt1.mockRestore();
    spyExt2.mockRestore();
  });
});
