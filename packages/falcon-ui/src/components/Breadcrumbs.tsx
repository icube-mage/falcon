import { themed } from '../theme';

export const Breadcrumbs = themed({
  tag: 'ul',

  defaultTheme: {
    breadcrumbs: {
      p: 'none',
      m: 'none',
      display: 'flex',
      flexWrap: 'wrap',

      css: {
        listStyle: 'none'
      }
    }
  }
});

export const Breadcrumb = themed({
  tag: 'li',

  defaultTheme: {
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',

      css: ({ theme }) => ({
        '::after': {
          content: '"→"',
          color: 'inherit',
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.xs,
          display: 'block'
        },

        ':last-child': {
          pointerEvents: 'none',
          color: theme.colors.primary,
          '::after': {
            display: 'none'
          }
        }
      })
    }
  }
});
