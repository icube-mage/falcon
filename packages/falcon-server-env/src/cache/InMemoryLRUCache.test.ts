import InMemoryLRUCache from './InMemoryLRUCache';

describe('InMemoryLRUCache', () => {
  let cache: InMemoryLRUCache;
  const DateNow = Date.now;
  let time = 0;
  const advanceTime = (ms: number) => {
    time += ms;
  };

  beforeAll(() => {
    cache = new InMemoryLRUCache();
    // node-lru uses Date.now to find out if data in the cache is obsolete, so mock it
    // to return our data values
    Date.now = () => time;
  });

  afterAll(() => {
    // restore original value
    Date.now = DateNow;
  });

  it('Should set data that expires', async () => {
    const cacheKey: string = 'key';
    const testValue: string = 'foo';
    let value: string | undefined = await cache.get(cacheKey);
    expect(value).toBeUndefined();

    await cache.set(cacheKey, testValue, { ttl: 200 });
    value = await cache.get(cacheKey);
    expect(value).toBe(testValue);

    advanceTime(201);
    value = await cache.get(cacheKey);
    expect(value).toBeUndefined();
  });
});
