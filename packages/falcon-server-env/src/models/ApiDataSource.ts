import * as Logger from '@deity/falcon-logger';
import { Body, Request, RESTDataSource } from 'apollo-datasource-rest/dist/RESTDataSource';
import { URL, URLSearchParams, URLSearchParamsInit } from 'apollo-server-env';
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql';
import { EventEmitter2 } from 'eventemitter2';
import { stringify } from 'qs';
import { format } from 'url';
import Cache from '../cache/Cache';
import ContextHTTPCache from '../cache/ContextHTTPCache';
import {
  ApiContainer,
  ApiUrlPriority,
  ApiDataSourceConfig,
  ConfigurableConstructorParams,
  ContextCacheOptions,
  ContextFetchResponse,
  ContextFetchRequest,
  ContextRequestInit,
  ContextRequestOptions,
  DataSourceConfig,
  GraphQLContext,
  FetchUrlParams,
  FetchUrlResult,
  PaginationData
} from '../types';

export type PaginationValue = number | string | null;

export interface GqlServerConfig {
  schema: GraphQLSchema;
}

export type ConfigurableContainerConstructorParams = ConfigurableConstructorParams<ApiDataSourceConfig> & {
  apiContainer: ApiContainer;
  gqlServerConfig: any;
};

export default abstract class ApiDataSource<TContext extends GraphQLContext = any> extends RESTDataSource<TContext> {
  public name: string;
  public config: ApiDataSourceConfig;
  public fetchUrlPriority: number = ApiUrlPriority.NORMAL;
  public perPage: number = 20;

  protected apiContainer: ApiContainer;
  protected eventEmitter: EventEmitter2;
  protected cache?: Cache;
  protected gqlServerConfig: GraphQLSchema;

  /**
   * @param {ConfigurableContainerConstructorParams} params Constructor params
   * @param {ApiDataSourceConfig} params.config API DataSource config
   * @param {string} params.name API DataSource short-name
   * @param {ApiContainer} params.apiContainer ApiContainer instance
   * @param {EventEmitter2} params.eventEmitter EventEmitter2 instance
   */
  constructor(params: ConfigurableContainerConstructorParams) {
    super();
    const { config, name, apiContainer, eventEmitter } = params;

    this.gqlServerConfig = params.gqlServerConfig;
    this.name = name || this.constructor.name;
    this.config = config || {};
    this.apiContainer = apiContainer;
    this.eventEmitter = eventEmitter;

    const { host, port, protocol, fetchUrlPriority, perPage } = this.config;
    if (host) {
      this.baseURL = format({
        protocol: protocol === 'https' || Number(port) === 443 ? 'https' : 'http',
        hostname: host,
        port: Number(port) || undefined
      });
    }

    this.fetchUrlPriority = fetchUrlPriority || this.fetchUrlPriority;
    this.perPage = perPage || this.perPage;

    // FIXME: nasty way of overriding "private" method and avoiding TSC errors.
    // Remove once there's an option for using an external logger.
    this['trace'] = this.traceLog.bind(this);
  }

  initialize(config: DataSourceConfig<TContext>): void {
    super.initialize(config);
    this.cache = config.cache;
    this.httpCache = new ContextHTTPCache(this.cache);
  }

  /**
   * Wrapper-method to get an API-scoped session data
   * @returns {any} API-scoped session data
   */
  get session(): any {
    if (!this.context.session) {
      return {};
    }

    if (!(this.name in this.context.session)) {
      this.context.session[this.name] = {};
    }

    return this.context.session[this.name];
  }

  /**
   * Wrapper-method to set an API-scoped session data
   * @param {any} value Value to be set to the API session
   * @return {undefined}
   */
  set session(value: any) {
    if (!this.context.session) {
      this.context.session = {};
    }

    this.context.session[this.name] = value;
  }

  /**
   * Should be implemented if ApiDataSource wants to deliver content via dynamic URLs.
   * It should return priority value for passed url.
   * @param url - url for which the priority should be returned
   * @return {number} Priority index
   */
  getFetchUrlPriority?(url: string): number;

  async fetchUrl?(
    obj: object,
    args: FetchUrlParams,
    context: TContext,
    info: GraphQLResolveInfo
  ): Promise<FetchUrlResult>;

  async fetchBackendConfig?(obj: object, args: object, context: TContext, info: GraphQLResolveInfo): Promise<object>;

  protected async willSendRequest(request: ContextRequestOptions): Promise<void> {
    const { context } = request;
    if (context && context.isAuthRequired && this.authorizeRequest) {
      await this.authorizeRequest(request);
    }
  }

  async authorizeRequest?(req: ContextRequestOptions): Promise<void>;

  /**
   * Calculates "pagination" data
   * @param {PaginationValue} totalItems Total amount of entries
   * @param {PaginationValue} [currentPage=null] Current page index
   * @param {PaginationValue} [perPage=null] Limit entries per page
   * @return {PaginationData} Calculated result
   */
  protected processPagination(
    totalItems: PaginationValue,
    currentPage: PaginationValue = null,
    perPage: PaginationValue = null
  ): PaginationData {
    /* eslint-disable no-underscore-dangle */
    const _totalItems: number = parseInt(totalItems as string, 10) || 0;
    const _perPage: number = parseInt(perPage as string, 10) || this.perPage;
    const _currentPage: number = parseInt(currentPage as string, 10) || 1;
    const _totalPages: number | null = _perPage ? Math.ceil(_totalItems / _perPage) : null;
    /* eslint-enable no-underscore-dangle */

    return {
      totalItems: _totalItems,
      totalPages: _totalPages,
      currentPage: _currentPage,
      perPage: _perPage,
      nextPage: _totalPages && _currentPage < _totalPages ? _currentPage + 1 : null,
      prevPage: _currentPage > 1 ? _currentPage - 1 : null
    };
  }

  protected async get<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init?: ContextRequestInit
  ): Promise<TResult> {
    const processedInit: ContextRequestInit = this.ensureContextPassed(init);
    return super.get<TResult>(path, this.preprocessParams(params), processedInit);
  }

  protected async post<TResult = any>(path: string, body?: Body, init?: ContextRequestInit): Promise<TResult> {
    const processedInit: ContextRequestInit = this.ensureContextPassed(init);
    return super.post<TResult>(path, body, processedInit);
  }

  protected async patch<TResult = any>(path: string, body?: Body, init?: ContextRequestInit): Promise<TResult> {
    const processedInit: ContextRequestInit = this.ensureContextPassed(init);
    return super.patch<TResult>(path, body, processedInit);
  }

  protected async put<TResult = any>(path: string, body?: Body, init?: ContextRequestInit): Promise<TResult> {
    const processedInit: ContextRequestInit = this.ensureContextPassed(init);
    return super.put<TResult>(path, body, processedInit);
  }

  protected async delete<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init?: ContextRequestInit
  ): Promise<TResult> {
    const processedInit: ContextRequestInit = this.ensureContextPassed(init);
    return super.delete<TResult>(path, this.preprocessParams(params), processedInit);
  }

  protected async didReceiveResponse<TResult = any>(res: ContextFetchResponse, req: Request): Promise<TResult> {
    const result: TResult = await super.didReceiveResponse<TResult>(res, req);
    const { context } = res;

    if (context && context.didReceiveResult) {
      return context.didReceiveResult(result, res);
    }
    return result;
  }

  protected cacheKeyFor(request: Request): string {
    const cacheKey: string = super.cacheKeyFor(request);
    // Note: temporary disabling "memoized" map due to issues with GraphQL resolvers,
    // GET-requests in particular ("fetchUrl" query)
    this.memoizedResults.delete(cacheKey);
    return cacheKey;
  }

  private ensureContextPassed(init?: ContextRequestInit): ContextRequestInit {
    const processedInit: ContextRequestInit = init || {};

    if (!processedInit.context) {
      processedInit.context = {};
    }
    if (!processedInit.cacheOptions) {
      processedInit.cacheOptions = {};
    }
    if (typeof processedInit!.cacheOptions === 'object') {
      (processedInit.cacheOptions as ContextCacheOptions).context = processedInit.context;
    }

    return processedInit;
  }

  /**
   * This is a temporary solution to override Apollo's own "trace" method to use external Logger
   * @param {string} label Trace label
   * @param {function} fn Callback to trace
   * @return {Promise<TResult>} Result
   */
  /* istanbul ignore next Skipping code coverage for "dev" function */
  private async traceLog<TResult>(label: string, fn: () => Promise<TResult>): Promise<TResult> {
    if (process && process.env && process.env.NODE_ENV === 'development') {
      const startTime = Date.now();
      try {
        return await fn();
      } finally {
        const duration = Date.now() - startTime;
        Logger.debug(`${this.name}: ${label} (${duration}ms)`);
      }
    } else {
      return fn();
    }
  }

  private preprocessParams(params?: URLSearchParamsInit): URLSearchParamsInit {
    // if params is plain object then convert it to URLSearchParam with help of qs.stringify - that way
    // we can be sure that nested object will be converted correctly to search params
    const searchString: string = stringify(params, {
      encodeValuesOnly: true
    });

    return new URLSearchParams(searchString);
  }
}
