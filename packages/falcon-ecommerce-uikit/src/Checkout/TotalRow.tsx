import React from 'react';
import { Box, Text } from '@deity/falcon-ui';
import { Price } from './../Locale';

export type TotalRowProps = {
  title: string;
  value: number;
  currency?: string;
};
export const TotalRow: React.SFC<TotalRowProps> = ({ title, value, currency, ...props }) => (
  <Box display="flex" {...props}>
    <Text flex="1">{title}</Text>
    <Price value={value} currency={currency} />
  </Box>
);
