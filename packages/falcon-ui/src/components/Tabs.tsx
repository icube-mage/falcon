import { themed } from '../theme';

export const Tabs = themed({
  tag: 'ul',

  defaultTheme: {
    tabs: {
      display: 'flex',
      p: 'xs',
      m: 'none',
      bg: 'primary',
      color: 'primaryText',
      boxShadow: 'subtle',
      css: {
        listStyle: 'none'
      },
      variants: {
        secondary: {
          boxShadow: 'none',
          color: 'black',
          bg: 'transparent'
        }
      }
    }
  }
});

export const Tab = themed({
  tag: 'li',

  defaultProps: {
    active: false
  },

  defaultTheme: {
    tab: {
      fontSize: 'sm',
      flex: 0,
      mr: 'md',
      px: 'md',
      py: 'xs',
      borderBottom: 'regular',

      css: props => ({
        transitionProperty: 'border-bottom-color',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short,
        borderBottomColor: props.active ? props.theme.colors.secondary : props.theme.colors.primary,
        cursor: props.active ? 'default' : 'pointer'
      }),
      variants: {
        secondary: {
          borderBottom: 'bold',
          css: props => ({
            borderBottomColor: props.active ? props.theme.colors.primary : props.theme.colors.secondary
          })
        }
      }
    }
  }
});
