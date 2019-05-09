import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, DefaultThemeProps, Link, Icon } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { BlogPagination } from './BlogPostsQuery';

const blogPostsPaginatorLayout: DefaultThemeProps = {
  blogPostsPaginatorLayout: {
    display: 'flex',
    my: 'xxxl'
  }
};

type BlogPostsPaginatorProps = {
  pagination: BlogPagination;
  blogUrlBase: string;
};

export const BlogPostsPaginator: React.SFC<BlogPostsPaginatorProps> = ({ pagination, blogUrlBase }) => (
  <Box defaultTheme={blogPostsPaginatorLayout} justifyContent={!pagination.prevPage ? 'flex-end' : 'space-between'}>
    {pagination.prevPage && (
      <Link
        display="flex"
        lineHeight="small"
        fontSize="md"
        as={RouterLink}
        to={`${blogUrlBase}/${pagination.prevPage}`}
      >
        <Icon size="md" mr="xs" src="prevPage" /> <T id="blog.newerEntries" />
      </Link>
    )}
    {pagination.nextPage && (
      <Link
        display="flex"
        lineHeight="small"
        fontSize="md"
        as={RouterLink}
        to={`${blogUrlBase}/${pagination.nextPage}`}
      >
        <T id="blog.olderEntries" /> <Icon ml="xs" size="md" src="nextPage" />
      </Link>
    )}
  </Box>
);

BlogPostsPaginator.defaultProps = {
  blogUrlBase: '/blog'
};
