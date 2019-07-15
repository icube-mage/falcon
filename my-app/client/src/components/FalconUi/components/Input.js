import { themed } from '@deity/falcon-ui';

function placeholder(styles) {
  return {
    '::-webkit-input-placeholder': styles,
    '::-moz-placeholder': styles,
    ':-ms-input-placeholder`': styles,
    '::-ms-input-placeholder`': styles
  };
}

export const Input =
  /* #__PURE__ */
  themed({
    tag: 'input',
    defaultProps: {
      type: 'text',
      invalid: false
    },
    defaultTheme: {
      input: {
        py: 'xs',
        px: 'sm',
        border: 'regular',
        borderRadius: 'medium',
        css: function css(_ref) {
          const { invalid, theme } = _ref;
          return Object.assign(
            {},
            placeholder({
              color: theme.colors.secondaryText
            }),
            {
              ':focus': {
                outline: 'none',
                borderColor: invalid ? theme.colors.error : theme.colors.secondary
              },
              borderColor: invalid ? theme.colors.error : theme.colors.secondaryDark,
              fontFamily: 'inherit',
              lineHeight: 'inherit',
              color: 'inherit',
              WebkitAppearance: 'none',
              width: '100%',
              fontSize: '16px'
            }
          );
        }
      }
    }
  });
// # sourceMappingURL=Input.js.map
