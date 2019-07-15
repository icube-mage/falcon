import React from 'react';
import PropTypes from 'prop-types';
import { MockedProvider } from 'react-apollo/test-utils';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '@deity/falcon-i18n';
import i18nFactory from './../src/i18n/__mocks__/i18nFactory';

/**
 * @typedef {Object} FalconClientProps
 * @property {Object} apollo react-apollo MockProvider props
 * @property {Object} router react-router-dom MemoryRouter props

 * @property {Object} i18next i18next options
 */

/**
 * FalconClientMock wrapper component
 * @property {FalconClientProps} props props
 * @returns {{}} FalconClientMock component
 */
const FalconClient = ({ apollo, router, i18next, children }) => {
  const extractor = new ChunkExtractor({ stats: { namedChunkGroups: {} } });

  return (
    <MockedProvider mocks={[]} addTypename={false} {...apollo}>
      <ChunkExtractorManager extractor={extractor}>
        <MemoryRouter {...router}>
          <I18nProvider i18n={i18nFactory(i18next)}>{children}</I18nProvider>
        </MemoryRouter>
      </ChunkExtractorManager>
    </MockedProvider>
  );
};

FalconClient.propTypes = {
  children: PropTypes.node.isRequired,
  apollo: PropTypes.shape({
    mocks: PropTypes.array,
    addTypename: PropTypes.bool
  }),

  router: PropTypes.shape({
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number
  }),

  i18next: PropTypes.shape({
    lng: PropTypes.string,
    fallbackLng: PropTypes.string,
    whitelist: PropTypes.arrayOf(PropTypes.string),
    debug: PropTypes.bool,
    defaultNS: PropTypes.string,
    resources: PropTypes.shape({})
  })
};

FalconClient.defaultProps = {
  apollo: {},
  router: {},
  i18next: {}
};

export default FalconClient;
