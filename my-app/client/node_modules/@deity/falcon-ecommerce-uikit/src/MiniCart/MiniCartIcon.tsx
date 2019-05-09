import React from 'react';
import { Box, Badge, Icon } from '@deity/falcon-ui';

export const MiniCartIcon: React.SFC<{
  onClick: Function;
  gridArea: string;
  itemsQty: number;
}> = ({ onClick, gridArea, itemsQty }) => (
  <Box gridArea={gridArea} onClick={() => onClick()} css={{ cursor: 'pointer', position: 'relative' }}>
    <Icon src="cart" />
    {itemsQty > 0 && (
      <Badge
        borderRadius="round"
        boxShadow="pronounced"
        fontSize="xs"
        size="md"
        fontWeight="bold"
        p="none"
        css={{
          position: 'absolute',
          bottom: '-10px',
          right: '-10px'
        }}
      >
        {itemsQty}
      </Badge>
    )}
  </Box>
);
