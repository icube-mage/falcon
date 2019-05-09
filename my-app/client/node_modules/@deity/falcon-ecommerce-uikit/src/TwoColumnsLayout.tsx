import React from 'react';
import { Box, themed } from '@deity/falcon-ui';
import { toGridTemplate } from './helpers';

export const TwoColumnsLayoutArea = {
  left: 'left',
  right: 'right'
};

export const TwoColumnsLayout = themed({
  tag: Box,
  defaultTheme: {
    twoColumnsLayout: {
      display: 'grid',
      alignItems: 'flex-start',
      gridColumnGap: { xs: 'sm', md: 'xxl' },
      gridRowGap: { xs: 'sm' },

      // prettier-ignore
      gridTemplate: {
        xs: toGridTemplate([
          ['1fr'                     ],
          [TwoColumnsLayoutArea.left ],
          [TwoColumnsLayoutArea.right]
        ]),
        md: toGridTemplate([
          ['1fr'                    , '1fr'                     ],
          [TwoColumnsLayoutArea.left, TwoColumnsLayoutArea.right]
        ])
      }
    }
  }
});
