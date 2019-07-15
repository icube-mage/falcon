import { themed, CSSObject } from '../theme';

const rangeInputTrack = (styles: CSSObject) => ({
  '::-webkit-slider-runnable-track': styles,
  '::-moz-range-track': styles,
  '::-ms-track': styles
});

const rangeInputThumb = (styles: CSSObject) => ({
  '::-webkit-slider-thumb ': styles,
  '::-moz-range-thumb': styles,
  '::-ms-thumb': styles
});

export const RangeInput = themed({
  tag: 'input',

  defaultProps: {
    type: 'range'
  },

  defaultTheme: {
    rangeInput: {
      height: 'xs',
      css: ({ theme }) => ({
        background: 'transparent',
        width: '100%',
        WebkitAppearance: 'none',

        ':focus': {
          outline: 'none'
        },
        ...rangeInputTrack({
          width: '100%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          border: 'none',
          borderRadius: theme.borderRadius.medium,
          height: '50%',
          background: theme.colors.secondary
        }),
        ...rangeInputThumb({
          WebkitAppearance: 'none',
          cursor: 'pointer',
          border: 'none',
          borderRadius: theme.borderRadius.round,
          background: theme.colors.primary,
          height: theme.spacing.sm,
          width: theme.spacing.sm,
          transition: 'transform',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short
        }),
        ':active': {
          ...rangeInputThumb({
            transform: 'scale(1.1)'
          })
        }
      })
    }
  }
});
