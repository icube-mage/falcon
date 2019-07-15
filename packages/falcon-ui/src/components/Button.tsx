import { themed } from '../theme';

export const Button = themed({
  tag: 'button',

  defaultTheme: {
    button: {
      color: 'primaryText',
      bg: 'primary',
      borderRadius: 'medium',
      fontSize: 'sm',
      lineHeight: 'small',
      height: 'lg',
      px: 'sm',
      transitionTimingFunction: 'easeIn',
      transitionDuration: 'short',
      border: 'none',

      css: ({ theme }) => ({
        // basic reset styles
        fontFamily: 'inherit',
        WebkitFontSmoothing: 'antialiased',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        textDecoration: 'none',
        appearance: 'none',
        cursor: 'pointer',
        ':focus': {
          outline: 'none'
        },
        // define transform that scales on active
        transitionProperty: 'transform',
        ':active': {
          transform: 'scale(0.95)'
        },
        ':hover:enabled': {
          backgroundColor: theme.colors.primaryLight
        },
        ':disabled': {
          opacity: 0.6,
          cursor: 'arrow'
        }
      }),

      variants: {
        secondary: {
          bg: 'secondary',
          color: 'secondaryText',

          css: ({ theme }) => ({
            ':hover': {
              backgroundColor: theme.colors.secondaryLight
            }
          })
        }
      }
    }
  }
});
