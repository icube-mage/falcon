import React from 'react';
import { Redirect } from 'react-router-dom';
// eslint-disable-next-line
import { Location } from 'history';
import { Text } from '@deity/falcon-ui';
import { Router } from './../Router';
import { UrlQuery } from './GetUrlQuery';

// export type contentType = 'shop-page' | 'shop-product' | 'shop-category';

export type DynamicRouteProps = {
  location?: Location;
  components: {
    /**
     * components map, where key is content Type e.g. `shop-page`, `shop-product`, `shop-category`, `blog-post`
     */
    [id: string]: React.ComponentType<{ path: string; id: string }>;
  };
  notFound: React.ComponentType<{ location: Location }>;
};
export const DynamicRoute: React.SFC<DynamicRouteProps> = props => {
  const { components, notFound } = props;

  return (
    <Router>
      {router => {
        const location = props.location || router.location;
        const { pathname } = location;
        const path = pathname.startsWith('/') ? pathname.substring(1) : pathname;

        return (
          <UrlQuery variables={{ path }}>
            {({ url }) => {
              if (url === null) {
                const NotFound = notFound;

                return <NotFound location={location} />;
              }

              if (url.redirect) {
                return <Redirect to={`/${url.path}`} />;
              }

              const Component = components[url.type];
              if (!Component) {
                return <Text>{`Please register component for '${url.type}' content type!`}</Text>;
              }

              return <Component id={url.id} path={url.path} />;
            }}
          </UrlQuery>
        );
      }}
    </Router>
  );
};
