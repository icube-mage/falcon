import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IsAuthenticatedQuery } from './../Customer/IsAuthenticatedQuery';

type OnlyUnauthenticatedRouteRouteProps = RouteProps & {
  redirectTo: string;
};

export const OnlyUnauthenticatedRoute: React.SFC<OnlyUnauthenticatedRouteRouteProps> = ({
  component,
  redirectTo,
  ...rest
}) => {
  const Component = component as React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;

  return (
    <Route
      {...rest}
      render={props => (
        <IsAuthenticatedQuery>
          {({ customer }) =>
            customer ? (
              <Redirect
                to={{
                  pathname: redirectTo
                }}
              />
            ) : (
              <Component {...props} />
            )
          }
        </IsAuthenticatedQuery>
      )}
    />
  );
};
OnlyUnauthenticatedRoute.defaultProps = {
  redirectTo: '/'
};
OnlyUnauthenticatedRoute.propTypes = {
  ...(Route as any).propTypes,
  redirectTo: PropTypes.string
};
