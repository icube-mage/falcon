import 'app-webmanifest';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { loadableReady } from '@loadable/component';
import { I18nProvider } from '@deity/falcon-i18n';
import { apolloClientWeb, apolloStateToObject } from './service';
import HtmlHead from './components/HtmlHead';
import App, { clientApolloSchema } from './clientApp';
import i18nFactory from './i18n/i18nClientFactory';
import { configureServiceWorker } from './serviceWorker';

// eslint-disable-next-line no-underscore-dangle
const initialState = window.__APOLLO_STATE__ || {};
const config = apolloStateToObject(initialState, '$ROOT_QUERY.config');

const { language } = window.I18NEXT_STATE || {};
const i18nConfig = { ...config.i18n, lng: language };
const renderApp = config.serverSideRendering ? hydrate : render;

loadableReady()
  .then(() => apolloClientWeb({ initialState, clientApolloSchema, apolloClientConfig: config.apolloClient }))
  .then(apolloClient => i18nFactory(i18nConfig).then(i18next => ({ apolloClient, i18next })))
  .then(({ apolloClient, i18next }) => {
    const markup = (
      <ApolloProvider client={apolloClient}>
        <I18nProvider i18n={i18next}>
          <BrowserRouter>
            <React.Fragment>
              <HtmlHead htmlLang={i18nConfig.lng} />
              <App />
            </React.Fragment>
          </BrowserRouter>
        </I18nProvider>
      </ApolloProvider>
    );

    renderApp(markup, document.getElementById('root'));
  })
  .then(() => configureServiceWorker());

if (module.hot) {
  module.hot.accept();
}
