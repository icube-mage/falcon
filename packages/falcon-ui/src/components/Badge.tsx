import { themed } from '../theme';

export const Badge = themed({
  tag: 'div',

  defaultTheme: {
    badge: {
      bg: 'primary',
      color: 'primaryText',
      px: 'xs',
      height: 'md',
      borderRadius: 'medium',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'xs'
    }
  }
});
