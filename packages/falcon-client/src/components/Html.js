import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleTagManager from '../google/GoogleTagManager';
import SerializeState from './SerializeState';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  renderGtm(noScript = false) {
    const { googleTagManager } = this.props;

    if (googleTagManager.id) {
      return <GoogleTagManager gtmId={googleTagManager.id} noScript={noScript} />;
    }

    return null;
  }

  render() {
    const { assets, children, helmetContext, chunkExtractor, state, i18nextState } = this.props;

    return (
      <html lang="en" {...helmetContext.htmlAttributes.toComponent()}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmetContext.base.toComponent()}
          {helmetContext.title.toComponent()}
          {helmetContext.meta.toComponent()}

          {this.renderGtm()}

          <link rel="shortcut icon" href="/favicon.ico" />
          {assets.webmanifest && <link rel="manifest" href={assets.webmanifest} type="application/manifest+json" />}

          {chunkExtractor.getLinkElements()}
          {chunkExtractor.getStyleElements()}

          {helmetContext.link.toComponent()}
          {helmetContext.script.toComponent()}
        </head>
        <body {...helmetContext.bodyAttributes.toComponent()}>
          {this.renderGtm(true)}

          <div id="root">{children}</div>

          <SerializeState variable="__APOLLO_STATE__" value={state} />
          <SerializeState variable="I18NEXT_STATE" value={i18nextState} />

          {chunkExtractor.getScriptElements()}
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  children: PropTypes.node,
  chunkExtractor: PropTypes.shape({}).isRequired,
  assets: PropTypes.shape({ webmanifest: PropTypes.string }),
  helmetContext: PropTypes.shape({}).isRequired,
  state: PropTypes.shape({}),
  i18nextState: PropTypes.shape({
    language: PropTypes.string,
    data: PropTypes.shape({})
  }),
  googleTagManager: PropTypes.shape({})
};

Html.defaultProps = {
  assets: { webmanifest: '' },
  state: {},
  i18nextState: {},
  googleTagManager: {}
};
