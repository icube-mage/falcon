import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { CheckoutPaymentMethod, CheckoutShippingMethod } from './CheckoutLogic';

export type EstimateShippingMethodsData = {
  estimateShippingMethods: CheckoutShippingMethod[];
};

export const ESTIMATE_SHIPPING_METHODS = gql`
  mutation EstimateShippingMethods($input: EstimateShippingInput!) {
    estimateShippingMethods(input: $input) {
      carrierTitle
      amount
      carrierCode
      methodCode
      methodTitle
      priceExclTax
      priceInclTax
      currency
    }
  }
`;

export class EstimateShippingMethodsMutation extends Mutation {
  static defaultProps = {
    mutation: ESTIMATE_SHIPPING_METHODS
  };
}

export type SetShippingData = {
  setShipping: {
    paymentMethods: CheckoutPaymentMethod[];
  };
};

export const SET_SHIPPING = gql`
  mutation SetShipping($input: ShippingInput) {
    setShipping(input: $input) {
      paymentMethods {
        code
        title
      }
    }
  }
`;

export class SetShippingMutation extends Mutation {
  static defaultProps = {
    mutation: SET_SHIPPING
  };
}

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      orderId
      orderRealId
    }
  }
`;

export class PlaceOrderMutation extends Mutation {
  static defaultProps = {
    mutation: PLACE_ORDER
  };
}
