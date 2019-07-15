import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { Box, H3, Text, Image, DefaultThemeProps, Link } from '@deity/falcon-ui';
import { BlogPostExcerptType } from './BlogPostsQuery';
import { DateFormat } from '../Locale';
import { toGridTemplate } from '../helpers';

const BlogPostEcerptArea = {
  image: 'image',
  title: 'title',
  date: 'date',
  excerpt: 'excerpt',
  readMore: 'readMore'
};

const blogPostExcerptLayout: DefaultThemeProps = {
  blogPostExcerptLayout: {
    display: 'grid',
    gridRowGap: 'xs',
    gridColumnGap: 'lg',
    color: 'black',
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        [ '1fr',                      ],
        [ BlogPostEcerptArea.image    ],
        [ BlogPostEcerptArea.date     ],
        [ BlogPostEcerptArea.title    ],
        [ BlogPostEcerptArea.excerpt  ],
        [ BlogPostEcerptArea.readMore ]
      ])
    },
    css: {
      textDecoration: 'none'
    }
  }
};

export const BlogPostExcerpt: React.SFC<{ excerpt: BlogPostExcerptType }> = ({ excerpt, ...rest }) => (
  <Box as="li" {...rest}>
    <Link as={RouterLink} to={excerpt.slug} defaultTheme={blogPostExcerptLayout}>
      {excerpt.image && (
        <Image
          css={{ height: 300 }}
          gridArea={BlogPostEcerptArea.image}
          src={excerpt.image.url}
          alt={excerpt.image.description}
        />
      )}
      <H3 gridArea={BlogPostEcerptArea.title}>{excerpt.title}</H3>
      <DateFormat gridArea={BlogPostEcerptArea.date} value={excerpt.date} />
      <Text gridArea={BlogPostEcerptArea.excerpt}>{excerpt.excerpt}</Text>
      <Text gridArea={BlogPostEcerptArea.readMore} css={{ textDecoration: 'underline' }}>
        <T id="blog.readMore" />
      </Text>
    </Link>
  </Box>
);
