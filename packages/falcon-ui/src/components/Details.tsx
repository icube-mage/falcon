import { themed } from '../theme';

export const Details = themed({
  tag: 'details',

  defaultProps: {
    open: false
  },

  defaultTheme: {
    details: {
      display: 'flex',
      flexDirection: 'column',

      css: props => ({
        '> :not(summary, style)': {
          display: props.open ? 'block' : 'none',
          flex: props.open ? '1' : 0
        },

        '> summary::-webkit-details-marker': {
          display: 'none'
        },

        '> summary:after': {
          display: 'block',
          content: props.open ? '"-"' : '"+"',
          marginLeft: props.theme.spacing.sm,
          fontSize: props.theme.fontSizes.md,
          lineHeight: 0.6,
          fontWeight: props.theme.fontWeights.bold,
          color: props.theme.colors.secondaryText
        }
      })
    }
  }
});

export const Summary = themed({
  tag: 'summary',

  defaultTheme: {
    summary: {
      fontSize: 'sm',
      py: 'xs',
      px: 'sm',
      mb: 'xs',
      bg: 'secondaryLight',
      lineHeight: 'small',
      borderRadius: 'medium',

      css: {
        outline: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative'
      }
    }
  }
});

export const DetailsContent = themed({
  tag: 'article',

  defaultTheme: {
    detailsContent: {
      py: 'xs',
      pl: 'xs'
    }
  }
});
