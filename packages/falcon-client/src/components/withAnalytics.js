import React from 'react';
import withApollo from 'react-apollo/withApollo';
import GAnalytics from 'ganalytics';
import { ANALYTICS } from '../graphql/analytics.gql';

let ga = null;

export default WrappedComponent => {
  const WithAnalytics = props => {
    if (process.browser && !ga) {
      const { client } = props;
      const { config } = client.readQuery({ query: ANALYTICS }) || {};
      const { googleAnalytics } = config || {};
      const { trackerID } = googleAnalytics || {};

      if (trackerID) {
        ga = new GAnalytics(trackerID, {}, true);
      }
    }

    return <WrappedComponent {...props} ga={ga} />;
  };

  return withApollo(WithAnalytics);
};
