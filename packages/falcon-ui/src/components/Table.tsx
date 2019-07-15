import { themed } from '../theme';

export const Table = themed({
  tag: 'table',

  defaultTheme: {
    table: {
      borderRadius: 'medium',
      fontSize: 'sm',
      display: {
        xs: 'block',
        sm: 'table'
      },
      css: {
        width: '100%',
        overflowY: {
          xs: 'hidden',
          md: 'initial'
        },
        tableLayout: 'auto',
        borderSpacing: 0,
        borderCollapse: 'collapse',
        borderStyle: 'hidden'
      }
    }
  }
});

export const Thead = themed({
  tag: 'thead',

  defaultTheme: {
    thead: {
      bg: 'secondary'
    }
  }
});

export const Th = themed({
  tag: 'th',

  defaultTheme: {
    th: {
      py: 'xs',
      px: 'sm',
      fontWeight: 'regular',

      css: {
        textAlign: 'left'
      }
    }
  }
});

export const Td = themed({
  tag: 'td',
  defaultTheme: {
    td: {
      p: 'sm',
      fontWeight: 'light',
      lineHeight: 'large',
      css: {
        textAlign: 'left'
      }
    }
  }
});

export const Tr = themed({
  tag: 'tr',
  defaultTheme: {
    tr: {
      display: 'table-row',
      borderTop: 'regular',
      borderColor: 'secondary'
    }
  }
});

export const Tbody = themed({
  tag: 'tbody',
  defaultTheme: {
    tbody: {
      fontSize: 'sm'
    }
  }
});
