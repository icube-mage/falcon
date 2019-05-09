# CheckoutLogic

CheckoutLogic components realises business logic related to checkout flow.

It provides current state of the checkout process and methods for manipulating with checkout.

## Usage

`CheckoutLogic` provides all the data related to the checkout process via render props so it needs to be rendered as React component in the application:

```jsx
<CheckoutLogic>
  {checkoutLogicData => (
    <div>
      <Button onClick={checkoutLogicData.setEmail('foo@bar.com')}>Set email</Button>
    </div>
  )}
</CheckoutLogic>
```

## API

The following props are provided by `CheckoutLogic`:

- `loading: bool` - flag that indicates that data loading/submitting is in progress
- `orderId: string` - order id that is set when order has been placed correctly
- `values: object` - map containing currently applied values:
  - `email: string` - user's email
  - `shippingAddress: object` - shipping address for the order
  - `billingAddres: object` - shipping address for the order
  - `billingSameAsShipping: bool` - flag that indicates that billing address is the same as shipping. When it's set to true then setting of `shippingAddress` sets automatically `billingAddress` to the same value
  - `shippingMethod: object` - selected shipping method (shape of the data is the same as shipping method sent from backend)
  - `paymentMethod: object` - selected payment method (shape of the data is the same as payment method sent from backend)
- `availableShippingMethods: object[]` - avilable shipping methods retrieved from backend when `shippingMethod` is set correctly
- `availablePaymentMethods: object[]` - available payment methods retrieved from backend when `shippingAddress` is set correctly
- `setEmail(email: string)` - sets email value
- `setShippingAddress(address: object)` - sets shipping address and triggers computation of available shipping methods which will be placed in `availableShippingMethods`
- `setBillingAddress(address: object)` - sets billing address
- `setBillingSameAsShipping(value: bool)` - sets `billingSameAsShipping` flag
- `setShippingMethod(shippingMethod: object)` - sets shipping method and triggers computation of available payment methods which will be placed in `availablePaymentMethods`
- `setPaymentMethod(paymentMethod: object)` - sets payment method
- `placeOrder()` - places order
