import { themed } from '../theme';

export const Avatar = themed({
  tag: 'img',

  defaultTheme: {
    avatar: {
      borderRadius: 'round',
      size: 'lg',

      css: {
        objectFit: 'contain',
        maxWidth: '100%'
      }
    }
  }
});
