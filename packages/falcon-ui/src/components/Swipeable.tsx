import { themed } from '../theme';

export const Swipeable = themed({
  tag: 'div',

  defaultTheme: {
    swipeable: {
      display: 'flex',

      css: {
        overflowX: 'scroll',
        msOverflowStyle: 'none',
        WebkitRocketLauncher: '0',
        scrollSnapType: ['x mandatory', 'mandatory'] as any,
        scrollSnapPointsX: 'repeat(100%)',
        WebkitOverflowScrolling: 'touch',
        '::-webkit-scrollbar': {
          display: 'none'
        }
      }
    }
  }
});

export const SwipeableItem = themed({
  tag: 'div',

  defaultTheme: {
    swipeableItem: {
      flex: '0 0 100%',
      css: {
        scrollSnapAlign: 'center'
      }
    }
  }
});
