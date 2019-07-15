import { themed } from '../theme';

export const Group = themed({
  tag: 'div',

  defaultTheme: {
    group: {
      display: 'flex',
      css: {
        // use first of type not first-child
        // details: https://github.com/emotion-js/emotion/issues/637
        '& > :first-of-type': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        },
        '> :not(:first-of-type):not(:last-child)': {
          borderRadius: 0
        },
        '> :last-child': {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        }
      }
    }
  }
});
