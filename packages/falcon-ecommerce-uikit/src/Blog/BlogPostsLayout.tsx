import React from 'react';
import { themed } from '@deity/falcon-ui';

export const BlogPostsLayout = themed({
  tag: 'ul',
  defaultTheme: {
    blogPostsLayout: {
      display: 'grid',
      my: 'lg',
      mx: 'none',
      gridGap: 'xl',
      gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(6, 1fr)'
      },
      p: 'none',
      css: {
        listStyle: 'none'
      }
    }
  }
});
