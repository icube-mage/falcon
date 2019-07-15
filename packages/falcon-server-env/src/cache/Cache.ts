/* eslint-disable no-useless-constructor, no-empty-function */
import { KeyValueCache } from 'apollo-server-caching';

export type SetCacheOptions = {
  ttl?: number;
};

export type CacheResult = string | undefined;

export type GetCacheCallbackResult =
  | CacheResult
  | {
      value: CacheResult;
      options?: SetCacheOptions;
    };

export type GetCacheParams = {
  key: string;
  callback: () => Promise<GetCacheCallbackResult>;
  options?: SetCacheOptions;
};

export default class Cache implements KeyValueCache {
  constructor(private cacheProvider: KeyValueCache) {}

  /**
   * Returns cached value for the provided key or options object
   * @param {string|GetCacheParams} keyOrOptions Cache key or object with specified callback method to provide
   * @return {Promise<string|undefined>} Cached value
   */
  async get(keyOrOptions: string | GetCacheParams): Promise<CacheResult> {
    const cacheKey: string = typeof keyOrOptions === 'string' ? keyOrOptions : keyOrOptions.key;
    let value: CacheResult = await this.cacheProvider.get(cacheKey);

    if (typeof value === 'undefined' && typeof keyOrOptions === 'object') {
      const { callback } = keyOrOptions;
      let { options } = keyOrOptions;
      const cacheResult: GetCacheCallbackResult = await callback();
      if (typeof cacheResult !== 'undefined') {
        if (typeof cacheResult === 'string') {
          value = cacheResult;
        } else if (typeof cacheResult === 'object') {
          ({ value } = cacheResult);
          if (cacheResult.options) {
            ({ options } = cacheResult);
          }
        }

        if (typeof value !== 'undefined') {
          await this.set(cacheKey, value, options);
        }
      }
    }

    return value;
  }

  async set(key: string, value: string, options?: SetCacheOptions): Promise<void> {
    return this.cacheProvider.set(key, value, options);
  }

  async delete(key: string): Promise<boolean | void> {
    return this.cacheProvider.delete(key);
  }
}
