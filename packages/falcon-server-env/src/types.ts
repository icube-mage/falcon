import { Response, Request } from 'apollo-server-env';
import { CacheOptions, RequestOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { IMiddleware } from 'koa-router';
import { RequestInit } from 'apollo-server-env';
import { EventEmitter2 } from 'eventemitter2';
import ApiDataSource from './models/ApiDataSource';
import Cache from './cache/Cache';

export interface DataSourceConfig<TContext> {
  context: TContext;
  cache: Cache;
}

export interface FetchUrlResult {
  id: string | number;
  type: string;
  path: string;
}

export enum ApiUrlPriority {
  HIGHEST = 1,
  HIGH = 2,
  NORMAL = 3,
  LOW = 4,
  LOWEST = 5,
  OFF = 0
}

export type DataSources = {
  [name: string]: ApiDataSource<GraphQLContext>;
};

export interface ConfigurableConstructorParams<T = object> {
  config?: T;
  name?: string;
  eventEmitter: EventEmitter2;
}

export type ContextType = {
  isAuthRequired?: boolean;
  didReceiveResult?: (result: any, res: ContextFetchResponse) => Promise<any>;
  [propName: string]: any;
};

export interface PaginationData {
  totalPages: number | null;
  totalItems: number;
  perPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface UrlConfig {
  host?: string;
  port?: number;
  protocol?: string;
}

export interface ApiDataSourceConfig extends UrlConfig {
  fetchUrlPriority?: number;
  perPage?: number;
  [propName: string]: any;
}

// todo: this is a temporary type just to have proper type checking in the Extension class. It needs to be improved.
export type ExtensionContainer = object;
export type ApiContainer = object;

export interface ContextData {
  context?: ContextType;
}

export interface GraphQLContext {
  session?: {
    [propName: string]: any;
  };
  headers?: {
    [propName: string]: string;
  };
  cache: Cache;
  dataSources: DataSources;
  [propName: string]: any;
}

export type ContextRequestInit = RequestInit & ContextData;

export type ContextCacheOptions = CacheOptions & ContextData;

export type ContextRequestOptions = RequestOptions & ContextData;

export type ContextFetchOptions = {
  cacheKey?: string;
  cacheOptions?:
    | ContextCacheOptions
    | ((response: ContextFetchResponse, request: ContextFetchRequest) => ContextCacheOptions | undefined);
};

export type ContextFetchRequest = Request & ContextData;

export type ContextFetchResponse = Response & ContextData;

export type FetchUrlParams = {
  path: string;
};

export interface EndpointEntry {
  methods: Array<RequestMethod>;
  handler: IMiddleware;
  path: string;
}

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  ALL = 'all'
}
