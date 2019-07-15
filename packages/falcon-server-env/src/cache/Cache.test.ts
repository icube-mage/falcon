import { KeyValueCache } from 'apollo-server-caching';
import Cache from './Cache';

describe('Cache', () => {
  let provider: KeyValueCache;
  let cache: Cache;

  beforeEach(() => {
    provider = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn()
    } as KeyValueCache;
    cache = new Cache(provider);
  });

  it('Should properly pass arguments to "set" method', async () => {
    await cache.set('key', 'value');
    expect(provider.set).toBeCalledWith('key', 'value', undefined);
    provider.set.mockClear();

    await cache.set('key', 'value', { ttl: 1 });
    expect(provider.set).toBeCalledWith('key', 'value', { ttl: 1 });
  });

  it('Should properly pass key to "delete" method', async () => {
    await cache.delete('foo');
    expect(provider.delete).toBeCalledWith('foo');
  });

  it('Should properly pass a string key to "get" method', async () => {
    const value: string | undefined = await cache.get('key');
    expect(provider.get).toBeCalledWith('key');
  });

  it('Should properly handle a callback option to fill the cache for "get" method', async () => {
    provider.get = jest.fn(() => undefined);
    const value: string | undefined = await cache.get({
      key: 'key',
      callback: () => 'new_value',
      options: {
        ttl: 1
      }
    });

    expect(provider.get).toBeCalledWith('key');
    expect(provider.set).toBeCalledWith('key', 'new_value', { ttl: 1 });
  });

  it('Should be able to define TTL dynamically from callback for "get" method', async () => {
    provider.get = jest.fn(() => undefined);
    const value: string | undefined = await cache.get({
      key: 'key',
      callback: () => ({
        value: 'value',
        options: {
          ttl: 10
        }
      })
    });

    expect(provider.get).toBeCalledWith('key');
    expect(provider.set).toBeCalledWith('key', 'value', { ttl: 10 });
  });
});
