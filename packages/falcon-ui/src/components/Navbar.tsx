import React from 'react';
import { Value } from 'react-powerplug';

import { themed } from '../theme';
import { Box } from './Box';
import { ListItem } from './List';

export const Navbar = themed({
  tag: 'ul',

  defaultTheme: {
    navbar: {
      p: 'none',
      m: 'none',
      bgFullWidth: 'primary',
      color: 'primaryText',
      css: {
        display: 'flex',
        listStyle: 'none',
        position: 'relative'
      }
    }
  }
});

const MenuItemContext = React.createContext<{ open?: boolean }>({});

const MenuItemInnerDOM: React.SFC<any> = ({ onMouseEnter, onMouseLeave, onClick, ...props }) => (
  <Value initial={false}>
    {({ set, value }) => (
      <MenuItemContext.Provider value={{ open: value }}>
        <ListItem
          {...props}
          onMouseEnter={e => {
            if (onMouseEnter) onMouseEnter(e);
            set(true);
          }}
          onMouseLeave={e => {
            set(false);
            if (onMouseLeave) onMouseLeave(e);
          }}
          onClick={e => {
            set(false);
            if (onClick) onClick(e);
          }}
        />
      </MenuItemContext.Provider>
    )}
  </Value>
);

export const NavbarItem = themed({
  tag: MenuItemInnerDOM,

  defaultTheme: {
    navbarItem: {
      fontSize: 'sm',
      display: 'flex',
      color: 'primaryText',

      css: ({ theme }) => ({
        cursor: 'pointer',
        userSelect: 'none',
        listStyle: 'none',

        ':hover': {
          background: theme.colors.secondary,
          color: theme.colors.secondaryText
        }
      })
    }
  }
});

const NavbarItemMenuInnerDOM: React.SFC<any> = props => (
  <MenuItemContext.Consumer>
    {({ open }) => <Box {...props} display={open ? 'block' : 'none'} />}
  </MenuItemContext.Consumer>
);
export const NavbarItemMenu = themed({
  tag: NavbarItemMenuInnerDOM,

  defaultProps: {
    role: 'menu'
  },

  defaultTheme: {
    navbarItemMenu: {
      p: 'sm',
      bg: 'secondary',
      color: 'secondaryText',
      boxShadow: 'subtle',
      css: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0
      }
    }
  }
});
