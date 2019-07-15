import { KeyValueCache } from 'apollo-server-caching';
import * as LRU from 'lru-cache';

export interface LRUOptions {
  maxSize?: number;
}

/**
 * Note: overriding the whole InMemoryLRUCache class from "apollo-server-caching",
 * because it doesn't pass "options.ttl" flag to LRU method nor expose "store" property
 */
export default class InMemoryLRUCache implements KeyValueCache {
  protected store: LRU.Cache<string, string>;

  constructor({ maxSize = Infinity }: LRUOptions = {}) {
    this.store = new LRU({
      max: maxSize,
      length: item => item.length
    });
  }

  async get(key: string): Promise<string | undefined> {
    return this.store.get(key);
  }

  async set(key: string, value: string, options?: { ttl?: number }) {
    this.store.set(key, value, options && options.ttl ? options.ttl : undefined);
  }

  async delete(key: string) {
    this.store.del(key);
  }
}
