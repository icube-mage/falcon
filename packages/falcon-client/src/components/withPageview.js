import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import withAnalytics from './withAnalytics';

export default WrappedComponent => {
  class WithPageview extends PureComponent {
    componentDidMount() {
      this.trackPage();
    }

    componentDidUpdate(prevProps) {
      const currentPage = this.props.location.pathname;
      const prevPage = prevProps.location.pathname;
      if (currentPage !== prevPage) {
        this.trackPage();
      }
    }

    trackPage() {
      const { ga } = this.props;
      if (!ga) {
        return;
      }

      ga.send('pageview');
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return withRouter(withAnalytics(WithPageview));
};
