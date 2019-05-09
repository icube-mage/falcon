import gql from 'graphql-tag';
import { Query } from '../Query/Query';

export const GET_CART = gql`
  query Cart {
    cart {
      itemsQty
      quoteCurrency
      couponCode
      totals {
        code
        title
        value
      }
      items {
        itemId
        sku
        qty
        name
        price
        rowTotalInclTax
        thumbnailUrl
        itemOptions {
          label
          value
        }
      }
    }
  }
`;

export type CartData = {
  cart: {
    itemsQty: number;
    quoteCurrency: string;
    couponCode: string;
    totals: CartTotal[];
    items: CartItem[];
  };
};

type CartTotal = {
  code: string;
  title: string;
  value: number;
};

type CartItem = {
  itemId: number;
  sku: string;
  qty: number;
  name: string;
  price: number;
  rowTotalInclTax: number;
  thumbnailUrl: string;
  itemOptions: CartItemOption[];
};

type CartItemOption = {
  label: string;
  value: string;
};

export class CartQuery extends Query<CartData> {
  static defaultProps = {
    query: GET_CART
  };
}
