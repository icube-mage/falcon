import React from 'react';
import { Icon, themed } from '@deity/falcon-ui';

export const LoaderLayout = themed({
  tag: 'div',
  defaultTheme: {
    loaderLayout: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      css: {
        height: '100vh',
        width: '100%'
      }
    }
  }
});

export const Loader = () => (
  <LoaderLayout>
    <Icon src="loader" />
  </LoaderLayout>
);
