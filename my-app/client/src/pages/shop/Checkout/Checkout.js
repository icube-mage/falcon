import React from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Box, H2, Button, Divider, Icon } from '@deity/falcon-ui';
import {
  CheckoutLogic,
  CartQuery,
  CountriesQuery,
  CustomerQuery,
  GET_CUSTOMER_WITH_ADDRESSES,
  toGridTemplate
} from '@deity/falcon-ecommerce-uikit';
import CheckoutCartSummary from './CheckoutCartSummary';
import CustomerSelector from './CustomerSelector';
import ShippingMethodSection from './ShippingMethodSection';
import PaymentMethodSection from './PaymentMethodSection';
import AddressSection from './AddressSection';
import ErrorList from '../components/ErrorList';
import { SnapQuery } from '../components/SnapQuery';

const CHECKOUT_STEPS = {
  EMAIL: 'EMAIL',
  SHIPPING_ADDRESS: 'SHIPPING_ADDRESS',
  BILLING_ADDRESS: 'BILLING_ADDRESS',
  SHIPPING: 'SHIPPING',
  PAYMENT: 'PAYMENT',
  CONFIRMATION: 'CONFIRMATION'
};

const CheckoutArea = {
  checkout: 'checkout',
  cart: 'cart',
  divider: 'divider'
};

const checkoutLayout = {
  checkoutLayout: {
    display: 'grid',
    gridGap: 'lg',
    my: 'lg',
    px: {
      sm: 'none',
      md: 'xxxl'
    },
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr'                ],
        [CheckoutArea.checkout],
        [CheckoutArea.divider ],
        [CheckoutArea.cart    ]
      ]),
      md: toGridTemplate([
        ['2fr',                 '1px',               '1fr'             ],
        [CheckoutArea.checkout, CheckoutArea.divider, CheckoutArea.cart]
      ])
    },
    css: ({ theme }) => ({
      // remove default -/+ icons in summary element
      'details summary:after': {
        display: 'none'
      },
      'details summary:active, details summary:focus': {
        outline: 'none'
      },
      'details summary': {
        paddingRight: theme.spacing.xxl
      },
      'details article': {
        paddingLeft: theme.spacing.xxl,
        paddingRight: theme.spacing.xxl
      }
    })
  }
};

// loader that covers content of the container (container must have position: relative/absolute)
const Loader = ({ visible }) => (
  <Box
    css={{
      position: 'absolute',
      display: visible ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.7)',
      height: '100%',
      width: '100%'
    }}
  >
    <Icon src="loader" />
  </Box>
);

// helper that computes step that should be open based on values from CheckoutLogic
const computeStepFromValues = (values, errors) => {
  if (!values.email || errors.email) {
    return CHECKOUT_STEPS.EMAIL;
  } else if (!values.shippingAddress || errors.shippingAddress) {
    return CHECKOUT_STEPS.SHIPPING_ADDRESS;
  } else if (!values.billingAddress || errors.billingAddress) {
    return CHECKOUT_STEPS.BILLING_ADDRESS;
  } else if (!values.shippingMethod || errors.shippingMethod) {
    return CHECKOUT_STEPS.SHIPPING;
  } else if (!values.paymentMethod || errors.paymentMethod) {
    return CHECKOUT_STEPS.PAYMENT;
  }
  return CHECKOUT_STEPS.CONFIRMATION;
};

class CheckoutWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: CHECKOUT_STEPS.EMAIL,
      getCurrentProps: () => this.props // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(nextProps, currentState) {
    const { checkoutData: currentPropsData } = currentState.getCurrentProps();
    const currentStepFromProps = computeStepFromValues(currentPropsData.values, currentPropsData.errors);
    const nextStepFromProps = computeStepFromValues(nextProps.checkoutData.values, nextProps.checkoutData.errors);

    const changedStep = { currentStep: nextStepFromProps };

    // if there's no step set yet then set it correctly
    if (!currentState.currentStep) {
      return changedStep;
    }

    // if loading has finished (changed from true to false) and there's no error then enforce current step
    // to value computed from the next props - this ensures that if user requested edit of particular step
    // then and it has been processed then we want to display step based on actual values from CheckoutLogic
    if (currentPropsData.loading && !nextProps.checkoutData.loading && !nextProps.checkoutData.error) {
      return changedStep;
    }

    // if step computed from props has changed then use it as new step
    if (nextStepFromProps !== currentStepFromProps) {
      return changedStep;
    }

    return null;
  }

  setCurrentStep = currentStep => this.setState({ currentStep });

  render() {
    const { currentStep } = this.state;
    const {
      values,
      loading,
      errors,
      orderId,
      availableShippingMethods,
      availablePaymentMethods,
      setEmail,
      setShippingAddress,
      setBillingAddress,
      setBillingSameAsShipping,
      setShippingMethod,
      setPaymentMethod,
      placeOrder
    } = this.props.checkoutData;

    const { customerData } = this.props;

    let addresses;
    let defaultShippingAddress;
    let defaultBillingAddress;

    // detect if user is logged in - if so and he has address list then use it for address sections
    if (customerData && customerData.addresses && customerData.addresses.length) {
      ({ addresses } = customerData);
      defaultShippingAddress = addresses.find(item => item.defaultShipping);
      defaultBillingAddress = addresses.find(item => item.defaultBilling);
    }

    if (orderId) {
      if (values.paymentMethod.code === 'snap') {
        return (
          <CountriesQuery>
            {({ countries }) => (
              <CartQuery>
                {({ cart }) => (
                  <Box defaultTheme={checkoutLayout}>
                    <Box gridArea={CheckoutArea.cart}>
                      <H2 fontSize="md" mb="md">
                        Summary
                      </H2>
                      <CheckoutCartSummary cart={cart} />
                      <Button as={RouterLink} mt="md" to="/cart">
                        Edit cart items
                      </Button>
                    </Box>
                    <Divider gridArea={CheckoutArea.divider} />
                    <Box gridArea={CheckoutArea.checkout} position="relative">
                      <Loader visible={loading} />
                      <CustomerSelector
                        open={currentStep === CHECKOUT_STEPS.EMAIL}
                        onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.EMAIL)}
                        email={values.email}
                        setEmail={setEmail}
                      />

                      <Divider my="md" />

                      <AddressSection
                        id="shipping-address"
                        open={currentStep === CHECKOUT_STEPS.SHIPPING_ADDRESS}
                        countries={countries.items}
                        onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.SHIPPING_ADDRESS)}
                        title="Shipping address"
                        submitLabel="Continue"
                        selectedAddress={values.shippingAddress}
                        setAddress={setShippingAddress}
                        errors={errors.shippingAddress}
                        availableAddresses={addresses}
                        defaultSelected={defaultShippingAddress}
                      />

                      <Divider my="md" />

                      <AddressSection
                        id="billing-address"
                        open={currentStep === CHECKOUT_STEPS.BILLING_ADDRESS}
                        onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.BILLING_ADDRESS)}
                        title="Billing address"
                        submitLabel="Continue"
                        countries={countries.items}
                        selectedAddress={values.billingAddress}
                        setAddress={setBillingAddress}
                        setUseTheSame={setBillingSameAsShipping}
                        useTheSame={values.billingSameAsShipping}
                        labelUseTheSame="My billing address is the same as shipping"
                        availableAddresses={addresses}
                        defaultSelected={defaultBillingAddress}
                      />

                      <Divider my="md" />

                      <ShippingMethodSection
                        open={currentStep === CHECKOUT_STEPS.SHIPPING}
                        onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.SHIPPING)}
                        shippingAddress={values.shippingAddress}
                        selectedShipping={values.shippingMethod}
                        setShippingAddress={setShippingAddress}
                        availableShippingMethods={availableShippingMethods}
                        setShipping={setShippingMethod}
                        errors={errors.shippingMethod}
                      />

                      <Divider my="md" />

                      <PaymentMethodSection
                        open={currentStep === CHECKOUT_STEPS.PAYMENT}
                        onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.PAYMENT)}
                        selectedPayment={values.paymentMethod}
                        availablePaymentMethods={availablePaymentMethods}
                        setPayment={setPaymentMethod}
                        errors={errors.paymentMethod}
                      />

                      <Divider my="md" />
                      <SnapQuery
                        variables={{
                          orderId
                        }}
                      >
                        {({ snapToken }) => (
                          <Box>
                            {snapToken.name}
                            <Divider my="md" />
                            <script
                              src="https://app.sandbox.midtrans.com/snap/snap.js"
                              src_type="url"
                              data-client-key="gjlgjskljglasjdgljsdg"
                            />
                          </Box>
                        )}
                      </SnapQuery>
                      <ErrorList errors={errors.order} />
                      {currentStep === CHECKOUT_STEPS.CONFIRMATION && <Button onClick={placeOrder}>Place order</Button>}
                    </Box>
                  </Box>
                )}
              </CartQuery>
            )}
          </CountriesQuery>
        );
      }
      // order has been placed successfully so we show confirmation
      return <Redirect to="/checkout/confirmation" />;
    }

    return (
      <CountriesQuery>
        {({ countries }) => (
          <CartQuery>
            {({ cart }) => {
              // cart is empty so redirect user to the homepage
              if (cart.itemsQty === 0) {
                return <Redirect to="/" />;
              }

              return (
                <Box defaultTheme={checkoutLayout}>
                  <Box gridArea={CheckoutArea.cart}>
                    <H2 fontSize="md" mb="md">
                      Summary
                    </H2>
                    <CheckoutCartSummary cart={cart} />
                    <Button as={RouterLink} mt="md" to="/cart">
                      Edit cart items
                    </Button>
                  </Box>
                  <Divider gridArea={CheckoutArea.divider} />
                  <Box gridArea={CheckoutArea.checkout} position="relative">
                    <Loader visible={loading} />
                    <CustomerSelector
                      open={currentStep === CHECKOUT_STEPS.EMAIL}
                      onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.EMAIL)}
                      email={values.email}
                      setEmail={setEmail}
                    />

                    <Divider my="md" />

                    <AddressSection
                      id="shipping-address"
                      open={currentStep === CHECKOUT_STEPS.SHIPPING_ADDRESS}
                      countries={countries.items}
                      onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.SHIPPING_ADDRESS)}
                      title="Shipping address"
                      submitLabel="Continue"
                      selectedAddress={values.shippingAddress}
                      setAddress={setShippingAddress}
                      errors={errors.shippingAddress}
                      availableAddresses={addresses}
                      defaultSelected={defaultShippingAddress}
                    />

                    <Divider my="md" />

                    <AddressSection
                      id="billing-address"
                      open={currentStep === CHECKOUT_STEPS.BILLING_ADDRESS}
                      onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.BILLING_ADDRESS)}
                      title="Billing address"
                      submitLabel="Continue"
                      countries={countries.items}
                      selectedAddress={values.billingAddress}
                      setAddress={setBillingAddress}
                      setUseTheSame={setBillingSameAsShipping}
                      useTheSame={values.billingSameAsShipping}
                      labelUseTheSame="My billing address is the same as shipping"
                      availableAddresses={addresses}
                      defaultSelected={defaultBillingAddress}
                    />

                    <Divider my="md" />

                    <ShippingMethodSection
                      open={currentStep === CHECKOUT_STEPS.SHIPPING}
                      onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.SHIPPING)}
                      shippingAddress={values.shippingAddress}
                      selectedShipping={values.shippingMethod}
                      setShippingAddress={setShippingAddress}
                      availableShippingMethods={availableShippingMethods}
                      setShipping={setShippingMethod}
                      errors={errors.shippingMethod}
                    />

                    <Divider my="md" />

                    <PaymentMethodSection
                      open={currentStep === CHECKOUT_STEPS.PAYMENT}
                      onEditRequested={() => this.setCurrentStep(CHECKOUT_STEPS.PAYMENT)}
                      selectedPayment={values.paymentMethod}
                      availablePaymentMethods={availablePaymentMethods}
                      setPayment={setPaymentMethod}
                      errors={errors.paymentMethod}
                    />

                    <Divider my="md" />

                    <ErrorList errors={errors.order} />
                    {currentStep === CHECKOUT_STEPS.CONFIRMATION && <Button onClick={placeOrder}>Place order</Button>}
                  </Box>
                </Box>
              );
            }}
          </CartQuery>
        )}
      </CountriesQuery>
    );
  }
}

const CheckoutPage = () => (
  <CheckoutLogic>
    {checkoutData => (
      <CustomerQuery query={GET_CUSTOMER_WITH_ADDRESSES}>
        {({ customer }) => <CheckoutWizard checkoutData={checkoutData} customerData={customer} />}
      </CustomerQuery>
    )}
  </CheckoutLogic>
);

export default CheckoutPage;
