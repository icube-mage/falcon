import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { GET_CART } from './CartQuery';

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      itemId
      sku
      qty
      name
      price
      productType
    }
  }
`;

export class AddToCartMutation extends Mutation {
  static defaultProps = {
    mutation: ADD_TO_CART,
    awaitRefetchQueries: true,
    refetchQueries: ['MiniCart', 'Cart']
  };
}

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($input: RemoveCartItemInput!) {
    removeCartItem(input: $input) {
      itemId
    }
  }
`;

export class RemoveCartItemMutation extends Mutation {
  static defaultProps = {
    mutation: REMOVE_CART_ITEM,
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
    update: (
      store: any,
      {
        data: {
          removeCartItem: { itemId }
        }
      }: any
    ) => {
      const data = store.readQuery({
        query: GET_CART
      });

      data.cart.items = data.cart.items.filter((item: any) => item.itemId !== itemId);
      data.cart.itemsQty = data.cart.items.length;

      store.writeQuery({
        query: GET_CART,
        data
      });
    }
  };
}

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      itemId
    }
  }
`;

export class UpdateCartItemMutation extends Mutation {
  static defaultProps = {
    mutation: UPDATE_CART_ITEM,
    awaitRefetchQueries: true,
    refetchQueries: ['MiniCart', 'Cart']
  };
}

export const APPLY_COUPON = gql`
  mutation ApplyCoupon($input: CouponInput!) {
    applyCoupon(input: $input)
  }
`;

export class ApplyCouponMutation extends Mutation {
  static defaultProps = {
    mutation: APPLY_COUPON,
    awaitRefetchQueries: true,
    refetchQueries: ['Cart']
  };
}

export const CANCEL_COUPON = gql`
  mutation CancelCoupon {
    cancelCoupon
  }
`;

export class CancelCouponMutation extends Mutation {
  static defaultProps = {
    mutation: CANCEL_COUPON,
    awaitRefetchQueries: true,
    refetchQueries: ['Cart']
  };
}
