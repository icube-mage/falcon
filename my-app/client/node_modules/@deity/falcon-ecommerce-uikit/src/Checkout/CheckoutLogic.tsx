import React from 'react';
import { withApollo, WithApolloClient, FetchResult } from 'react-apollo';
import isEqual from 'lodash.isequal';
import {
  ESTIMATE_SHIPPING_METHODS,
  EstimateShippingMethodsData,
  SET_SHIPPING,
  SetShippingData,
  PLACE_ORDER
} from './CheckoutMutation';

type CheckoutAddress = {
  id?: number;
  firstname: string;
  lastname: string;
  city: string;
  postcode: string;
  company?: string;
  countryId: string;
  region?: string;
  regionId?: number;
  street: string[];
  telephone: string;
};

export type CheckoutShippingMethod = {
  carrierTitle: string;
  amount: number;
  carrierCode: string;
  methodCode: string;
  methodTitle: string;
  priceExclTax: number;
  priceInclTax: number;
  currency: string;
};

export type CheckoutPaymentMethod = {
  code: string;
  title: string;
};

type CheckoutLogicData = {
  email: string | null;
  shippingAddress: CheckoutAddress | null;
  billingAddress: CheckoutAddress | null;
  billingSameAsShipping: boolean | null;
  shippingMethod: CheckoutShippingMethod | null;
  paymentMethod: CheckoutPaymentMethod | null;
};

type CheckoutLogicError = {
  message: string;
};

type CheckoutErrors = CheckoutLogicError[];

type CheckoutLogicState = {
  loading: boolean;
  errors: CheckoutLogicErrors;
  values: CheckoutLogicData;
  orderId?: string;
  availableShippingMethods: CheckoutShippingMethod[];
  availablePaymentMethods: CheckoutPaymentMethod[];
};

type CheckoutLogicErrors = {
  email?: CheckoutErrors;
  shippingAddress?: CheckoutErrors;
  billingSameAsShipping?: CheckoutErrors;
  billingAddress?: CheckoutErrors;
  shippingMethod?: CheckoutErrors;
  paymentMethod?: CheckoutErrors;
  order?: CheckoutErrors;
};

export type CheckoutLogicInjectedProps = {
  values: CheckoutLogicData;
  errors: CheckoutLogicErrors;
  loading: boolean;
  availableShippingMethods: CheckoutShippingMethod[];
  availablePaymentMethods: CheckoutPaymentMethod[];
  orderId?: string;
  setEmail(email: string): void;
  setShippingAddress(address: CheckoutAddress): void;
  setBillingSameAsShipping(same: boolean): void;
  setBillingAddress(address: CheckoutAddress): void;
  setShippingMethod(shipping: CheckoutShippingMethod): void;
  setPaymentMethod(payment: CheckoutPaymentMethod): void;
  placeOrder(): void;
};

export type CheckoutLogicProps = WithApolloClient<{
  initialValues?: CheckoutLogicData;
  children(props: CheckoutLogicInjectedProps): any;
}>;

class CheckoutLogicImpl extends React.Component<CheckoutLogicProps, CheckoutLogicState> {
  private isComponentMounted: boolean; // eslint-disable-line react/sort-comp

  constructor(props: CheckoutLogicProps) {
    super(props);
    this.state = {
      loading: false,
      values: props.initialValues || ({ billingSameAsShipping: false } as any),
      errors: {},
      availablePaymentMethods: [],
      availableShippingMethods: []
    };
    this.isComponentMounted = false;
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  setPartialState(partial: any, callback?: () => void) {
    // make sure that setState() is not called after component has been unmounted - we need that guard
    // as ApolloClient sometimes call finish callback twice. In that case CheckoutLogic might already be
    // unmounted when ApolloClient calls the finish callback again - that would print React's warning
    if (!this.isComponentMounted) {
      return;
    }
    this.setState(
      state =>
        // "deep replace" - replace old values with new, don't merge these
        ({
          ...state,
          ...partial,
          values: {
            ...state.values,
            ...(partial.values || {})
          }
        }),
      callback
    );
  }

  setLoading(loading: boolean, callback?: () => void) {
    this.setPartialState({ loading }, callback);
  }

  getShippingMethodData(shippingMethod: CheckoutShippingMethod) {
    return {
      shippingCarrierCode: shippingMethod.carrierCode,
      shippingMethodCode: shippingMethod.methodCode
    };
  }

  setEmail = (email: string) =>
    this.setLoading(true, () => this.setPartialState({ loading: false, values: { email } }));

  // the following setters first set loading to true, and then in the callback actual values is set
  // and loading flag gets reset to false, so the flow goes through whole proces (loading > set value > loaded)
  setBillingSameAsShipping = (same: boolean) =>
    this.setLoading(true, () =>
      this.setPartialState({
        loading: false,
        values: {
          billingSameAsShipping: same,
          billingAddress: same ? this.state.values.shippingAddress : null
        }
      })
    );

  setBillingAddress = (billingAddress: CheckoutAddress) =>
    this.setLoading(true, () => this.setPartialState({ loading: false, values: { billingAddress } }));

  setPaymentMethod = (paymentMethod: CheckoutPaymentMethod) =>
    this.setLoading(true, () => this.setPartialState({ loading: false, values: { paymentMethod } }));

  setShippingAddress = (shippingAddress: CheckoutAddress) => {
    this.setLoading(true, () => {
      // trigger mutation that will return available shipping options
      this.props.client
        .mutate<EstimateShippingMethodsData>({
          mutation: ESTIMATE_SHIPPING_METHODS,
          variables: { input: { address: shippingAddress } }
        })
        .then((resp: FetchResult) => {
          if (resp.errors) {
            this.setPartialState({
              loading: false,
              errors: { shippingAddress: resp.errors },
              availableShippingMethods: null
            });
          } else {
            const values = { shippingAddress } as CheckoutLogicData;

            // if billing is set to the same as shipping then set it also to received value
            if (this.state.values.billingSameAsShipping) {
              values.billingAddress = shippingAddress;
            }

            const { estimateShippingMethods } = resp.data!;
            // if shipping methods has changed then remove already selected shipping method
            if (!isEqual(estimateShippingMethods, this.state.availableShippingMethods)) {
              values.shippingMethod = null;
            }

            this.setPartialState({
              loading: false,
              errors: {},
              values,
              availableShippingMethods: estimateShippingMethods
            });
          }
        })
        .catch(error => {
          this.setPartialState({
            loading: false,
            errors: { shippingAddress: [error] }
          });
        });
    });
  };

  setShippingMethod = (shippingMethod: CheckoutShippingMethod) => {
    this.setLoading(true, () => {
      // trigger mutation that will return available payment options
      this.props.client
        .mutate<SetShippingData>({
          mutation: SET_SHIPPING,
          // refetch cart because totals have changed once shipping has been selected
          refetchQueries: ['Cart'],
          awaitRefetchQueries: true,
          variables: {
            input: {
              billingAddress: this.state.values.billingAddress,
              shippingAddress: this.state.values.shippingAddress,
              ...this.getShippingMethodData(shippingMethod)
            }
          }
        })
        .then((resp: FetchResult) => {
          if (resp.errors) {
            this.setPartialState({
              loading: false,
              errors: { shippingMethod: resp.errors },
              availablePaymentMethods: null
            });
          } else {
            const values = { shippingMethod } as CheckoutLogicData;
            // if available payment methods has changed then remove selected payment method
            if (!isEqual(resp.data!.setShipping.paymentMethods, this.state.availablePaymentMethods)) {
              values.paymentMethod = null;
            }

            this.setPartialState({
              loading: false,
              errors: {},
              values,
              availablePaymentMethods: resp.data!.setShipping.paymentMethods
            });
          }
        })
        .catch(error => {
          this.setPartialState({
            loading: false,
            errors: { shippingMethod: [error] }
          });
        });
    });
  };

  placeOrder = () => {
    const handleResponse = (resp: FetchResult) => {
      if (resp.errors) {
        this.setPartialState({
          loading: false,
          errors: {
            order: resp.errors
          }
        });
      } else {
        this.setPartialState({
          loading: false,
          error: null,
          orderId: resp.data!.placeOrder.orderId
        });
      }
    };

    this.setLoading(true, () => {
      this.props.client
        .mutate({
          mutation: PLACE_ORDER,
          // update cart once order is placed successfully
          refetchQueries: ['Cart', 'Orders'],
          awaitRefetchQueries: true,
          // when refetchQueries and awaitRefetchQueries are set then we cannot use promise
          // because it's not called (Apollo's bug), but we can update state based on
          // update() callback
          update: (_, resp) => handleResponse(resp),
          variables: {
            input: {
              email: this.state.values.email,
              paymentMethod: {
                method: this.state.values.paymentMethod!.code
              }
            }
          }
        })
        // promise catches the errors which are not passed to update callback
        .then(handleResponse)
        .catch(error => handleResponse({ errors: [error] }));
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.props.children({
          loading: this.state.loading,
          values: this.state.values,
          errors: this.state.errors,
          orderId: this.state.orderId,
          availablePaymentMethods: this.state.availablePaymentMethods,
          availableShippingMethods: this.state.availableShippingMethods,
          setEmail: this.setEmail,
          setShippingAddress: this.setShippingAddress,
          setBillingAddress: this.setBillingAddress,
          setBillingSameAsShipping: this.setBillingSameAsShipping,
          setShippingMethod: this.setShippingMethod,
          setPaymentMethod: this.setPaymentMethod,
          placeOrder: this.placeOrder
        })}
      </React.Fragment>
    );
  }
}

export const CheckoutLogic = withApollo(CheckoutLogicImpl);
