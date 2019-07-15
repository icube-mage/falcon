import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './Box';
import { Icon } from './Icon';

const RadioInnerDOM = (
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { icon: JSX.Element }
) => {
  const { className, icon, ...remaining } = props;
  const { themableProps, rest } = extractThemableProps(remaining);

  return (
    <Box {...themableProps} className={className}>
      <input {...rest} type="radio" />
      <div aria-hidden className="-inner-radio-frame">
        {icon}
      </div>
    </Box>
  );
};

export const Radio = themed({
  tag: RadioInnerDOM,

  defaultProps: {
    icon: (
      <Icon
        className="-inner-radio-icon"
        src="radioCheckedIcon"
        fallback={
          <svg viewBox="0 0 24 24" className="-inner-radio-icon" focusable="false">
            <circle cx="12" cy="12" r="10" />
          </svg>
        }
      />
    )
  },

  defaultTheme: {
    radio: {
      size: 'md',

      css: ({ theme }) => ({
        display: 'inline-flex',
        position: 'relative',
        // radio input is not visible but interactive
        input: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          opacity: 0,
          zIndex: 1,
          ':checked + .-inner-radio-frame': {
            borderColor: theme.colors.primary,
            '.-inner-radio-icon': {
              opacity: 1,
              fill: theme.colors.primary
            }
          },
          ':hover + .-inner-radio-frame': {
            borderColor: theme.colors.primaryLight,
            '.-inner-radio-icon': {
              fill: theme.colors.primaryLight
            }
          }
        },

        '.-inner-radio-icon': {
          height: 'calc(100% - 4px)',
          width: 'calc(100% - 4px)',
          display: 'block',
          opacity: 0,
          stroke: 'none',
          fill: theme.colors.white,
          transitionProperty: 'opacity, fill',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short
        },

        '.-inner-radio-frame': {
          height: '100%',
          width: '100%',
          position: 'relative',
          display: 'flex',
          cursor: 'pointer',
          borderRadius: theme.borderRadius.round,
          border: theme.borders.bold,
          borderColor: theme.colors.secondaryDark,
          transitionProperty: 'border, fill',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short,
          justifyContent: 'center',
          alignItems: 'center'
        }
      })
    }
  }
});
