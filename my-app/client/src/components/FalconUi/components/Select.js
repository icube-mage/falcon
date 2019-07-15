import { themed } from '@deity/falcon-ui';

export const Select =
  /* #__PURE__ */
  themed({
    tag: 'select',
    defaultProps: {
      invalid: false
    },
    defaultTheme: {
      select: {
        py: 'xs',
        px: 'sm',
        border: 'regular',
        borderRadius: 'medium',
        css: function css(_ref) {
          const { theme, invalid } = _ref;
          return {
            fontSize: '16px',
            display: 'block',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            color: 'inherit',
            borderColor: invalid ? theme.colors.error : theme.colors.secondaryDark,
            width: '100%',
            outline: 'none',
            position: 'relative',
            ':focus': {
              outline: 'none',
              borderColor: theme.colors.secondary
            },
            background:
              'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItY2hldnJvbi1kb3duIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=) 99% 50% no-repeat;',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            '::-ms-expand': {
              display: 'none'
            }
          };
        }
      }
    }
  });
export const Option =
  /* #__PURE__ */
  themed({
    tag: 'option',
    defaultTheme: {
      option: {
        fontSize: 'sm',
        css: {
          fontFamily: 'inherit'
        }
      }
    }
  });
// # sourceMappingURL=Select.js.map
