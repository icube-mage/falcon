// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-extended';
import React from 'react';
import Helmet from 'react-helmet';
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router-dom';
import Koa from 'koa';
import supertest from 'supertest';
import { BaseSchema } from '@deity/falcon-server';
import { T } from '@deity/falcon-i18n';
import { Server } from './server';
import DynamicRoute from './components/DynamicRoute';
import defaultConfiguration from './clientApp/defaultConfiguration';

describe('Server', () => {
  it('Should properly call eventHandlers', () => {
    const onServerCreatedMock = jest.fn();
    const onServerInitializedMock = jest.fn();
    const onServerStartedMock = jest.fn();
    const config = defaultConfiguration({
      serverSideRendering: true,
      logLevel: 'error'
    });
    const bootstrap = {
      config,
      onServerCreated: onServerCreatedMock,
      onServerInitialized: onServerInitializedMock,
      onServerStarted: onServerStartedMock
    };

    const server = Server({
      App: () => <div />,
      bootstrap,
      clientApolloSchema: {
        defaults: {}
      },
      webpackAssets: {}
    });
    server.started();

    expect(server.instance).toBeInstanceOf(Koa);
    expect(onServerCreatedMock).toBeCalledWith(server.instance);

    expect(onServerInitializedMock).toBeCalledWith(server.instance);
    expect(onServerInitializedMock).toHaveBeenCalledAfter(onServerCreatedMock);

    expect(onServerStartedMock).toBeCalledWith(server.instance);
    expect(onServerStartedMock).toHaveBeenCalledAfter(onServerInitializedMock);
  });

  it('Should render Home page (SSR)', async () => {
    Helmet.canUseDOM = false;
    const Home = () => (
      <div>
        <h2>Foo</h2>
        <p>
          <T id="key" />
        </p>
      </div>
    );

    const App = () => (
      <Switch>
        <Route exact path="/" component={Home} />
        <DynamicRoute
          components={{
            shop: loadable(() => import('./__mocks__/pages/Shop')),
            post: loadable(() => import('./__mocks__/pages/Post'))
          }}
        />
      </Switch>
    );

    const config = defaultConfiguration({
      logLevel: 'error',
      serverSideRendering: true,
      googleTagManager: { id: null },
      i18n: {
        lng: 'en',
        resources: { en: { translations: { key: 'foo bar baz' } } }
      },
      apolloClient: {
        httpLink: {
          typeDefs: [BaseSchema],
          resolvers: {
            Query: {
              backendConfig: () => ({
                locales: ['en-US'],
                activeLocale: 'en-US'
              })
            }
          }
        }
      }
    });

    const bootstrap = {
      config,
      onServerCreated: () => {},
      onServerInitialized: () => {}
    };
    const clientApolloSchema = {
      defaults: {},
      resolvers: {
        Query: {}
      }
    };

    const serverHandler = Server({
      App,
      bootstrap,
      clientApolloSchema,
      webpackAssets: {},
      loadableStats: {
        namedChunkGroups: {
          client: {
            chunks: [],
            assets: [],
            children: {},
            childAssets: {}
          }
        }
      }
    }).callback();

    const response = await supertest(serverHandler).get('/');

    expect(response.status).toBe(200);
    expect(response.headers).toContainKey('server-timing');
    expect(response.text).toEqual(expect.stringContaining('<h2>Foo</h2>'));
    expect(response.text).toEqual(expect.stringContaining('<p>foo bar baz</p>'));
  });
});
