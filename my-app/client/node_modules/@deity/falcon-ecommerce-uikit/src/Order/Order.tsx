import React from 'react';
import { Box, Image, Text, DefaultThemeProps } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { Price } from './../Locale';
import { toGridTemplate } from './../helpers';
import { OrderItem } from './OrderQuery';

const MAX_THUMB_SIZE = '80px';

const orderItemSummaryArea = {
  thumb: 'thumb',
  name: 'name',
  price: 'price',
  details: 'details'
};

export const orderItemSummaryLayout: DefaultThemeProps = {
  orderedItemSummaryLayout: {
    display: 'grid',
    gridGap: 'sm',
    fontSize: 'xs',
    // prettier-ignore
    gridTemplate: toGridTemplate([
      [MAX_THUMB_SIZE, '1fr', '60px'],
      [orderItemSummaryArea.thumb, orderItemSummaryArea.name, orderItemSummaryArea.price],
      [orderItemSummaryArea.thumb, orderItemSummaryArea.details, orderItemSummaryArea.details]
    ])
  }
};

export const OrderItemSummary: React.SFC<OrderItem> = props => (
  <Box defaultTheme={orderItemSummaryLayout}>
    <Image
      gridArea={orderItemSummaryArea.thumb}
      src={props.thumbnailUrl}
      css={{ maxWidth: MAX_THUMB_SIZE, maxHeight: MAX_THUMB_SIZE }}
    />
    <Text gridArea={orderItemSummaryArea.name} fontWeight="bold">
      {props.name}
    </Text>
    <Price
      gridArea={orderItemSummaryArea.price}
      value={props.rowTotalInclTax}
      fontWeight="bold"
      css={{ textAlign: 'right' }}
    />
    <Box gridArea={orderItemSummaryArea.details} display="flex" fontSize="xs">
      <Text flex="1">
        <T id="order.quantityLabel" />
      </Text>
      <Text flex="2">{props.qty}</Text>
    </Box>
  </Box>
);
