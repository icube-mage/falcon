import React from 'react';
import { DefaultThemeProps, Box, H3 } from '@deity/falcon-ui';

const miniFormLayout: DefaultThemeProps = {
  miniFormLayout: {
    display: 'grid',
    gridRowGap: 'md'
  }
};

export const MiniFormLayout: React.SFC<{ title?: string }> = ({ title, children }) => (
  <Box defaultTheme={miniFormLayout}>
    {title && <H3>{title}</H3>}
    <Box
      css={{
        maxWidth: 300,
        width: '100%',
        margin: '0 auto'
      }}
    >
      {children}
    </Box>
  </Box>
);
