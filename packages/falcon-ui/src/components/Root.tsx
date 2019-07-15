import { themed } from '../theme';

export const Root = themed({
  tag: 'div',

  defaultTheme: {
    root: {
      fontFamily: 'sans',
      fontSize: 'sm',
      lineHeight: 'default',
      color: 'black',
      css: {
        overflowX: 'hidden',
        '*': {
          boxSizing: 'border-box'
        }
      }
    }
  }
});
