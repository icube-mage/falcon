import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IsAuthenticatedQuery } from './../Customer/IsAuthenticatedQuery';

type ProtectedRouteProps = RouteProps & {
  redirectTo: string;
};

export const ProtectedRoute: React.SFC<ProtectedRouteProps> = ({ component, redirectTo, ...rest }) => {
  const Component = component as React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;

  return (
    <Route
      {...rest}
      render={props => (
        <IsAuthenticatedQuery>
          {({ customer }) => {
            if (customer) {
              return <Component {...props} />;
            }

            const { location } = props;
            const { pathname, search } = location;

            return (
              <Redirect
                to={{
                  pathname: redirectTo,
                  search: `?${new URLSearchParams({ next: `${pathname}${search}` })}`,
                  state: { nextLocation: location }
                }}
              />
            );
          }}
        </IsAuthenticatedQuery>
      )}
    />
  );
};
ProtectedRoute.defaultProps = {
  redirectTo: '/sign-in'
};
ProtectedRoute.propTypes = {
  ...(Route as any).propTypes,
  redirectTo: PropTypes.string
};
