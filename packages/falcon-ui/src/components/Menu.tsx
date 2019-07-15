import { themed } from '../theme';
import { List, ListItem } from './List';

export const Menu = themed({
  tag: List,

  defaultTheme: {
    menu: {
      p: 'none',
      m: 'none',
      bg: 'primary',
      color: 'primaryText',
      css: {
        display: 'flex',
        flexDirection: 'column',
        listStyle: 'none',
        position: 'relative'
      }
    }
  }
});

export const MenuItem = themed({
  tag: ListItem,

  defaultTheme: {
    menuItem: {
      fontSize: 'sm',
      fontWeight: 'bold',
      display: 'flex',
      color: 'primaryText',

      css: ({ theme }) => ({
        cursor: 'pointer',
        userSelect: 'none',
        listStyle: 'none',

        ':not(:last-child)': {
          borderBottom: theme.borders.regular,
          borderColor: theme.colors.secondaryDark
        },

        ':hover': {
          background: theme.colors.primaryLight,
          borderColor: theme.colors.secondaryLight
        }
      })
    }
  }
});
