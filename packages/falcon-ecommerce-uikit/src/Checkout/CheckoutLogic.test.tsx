import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { BaseSchema } from '@deity/falcon-server';
import { Schema } from '@deity/falcon-shop-extension';

import { CheckoutLogic, CheckoutLogicInjectedProps } from './CheckoutLogic';
import { wait } from '../../../../test/helpers';

const sampleAddress = {
  id: 1,
  firstname: 'foo',
  lastname: 'bar',
  city: 'Sample City',
  postcode: '00000',
  street: ['Sample Street 12'],
  countryId: 'NL',
  telephone: '000000000'
};

const sampleShippingMethod = {
  carrierTitle: 'test carrier',
  amount: 10,
  carrierCode: 'test',
  methodCode: 'test',
  methodTitle: 'Test Carrier',
  priceExclTax: 8,
  priceInclTax: 10,
  currency: 'EUR'
};

const samplePaymentMethod = {
  code: 'sample-payment',
  title: 'Sample Payment'
};

const resolversWithoutErrors = {
  Mutation: {
    estimateShippingMethods: () => [sampleShippingMethod],
    setShipping: () => ({
      paymentMethods: [samplePaymentMethod]
    }),
    placeOrder: () => ({
      orderId: 10,
      orderRealId: '010'
    })
  }
};

const resolversWithErrors = {
  Mutation: {
    estimateShippingMethods: () => {
      throw new Error('estimateShippingMethods error');
    },
    setShipping: () => {
      throw new Error('setShipping error');
    },
    placeOrder: () => {
      throw new Error('placeOrder error');
    }
  }
};

const createApolloClient = (resolvers: any) => {
  const schema = mergeSchemas({
    schemas: [makeExecutableSchema({ typeDefs: [BaseSchema, Schema] })],
    resolvers
  });
  const link = new SchemaLink({ schema });
  const cache = new InMemoryCache({ addTypename: false });
  return new ApolloClient({
    link,
    cache,
    defaultOptions: {
      query: {
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  });
};

describe('CheckoutLogic', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let client: ApolloClient<any>;

  const renderCheckoutLogic = (): { getProps: () => CheckoutLogicInjectedProps; wrapper: ReactWrapper<any, any> } => {
    let injectedProps: CheckoutLogicInjectedProps;
    wrapper = mount(
      <ApolloProvider client={client}>
        <CheckoutLogic>
          {logicData => {
            injectedProps = logicData;
            return <div />;
          }}
        </CheckoutLogic>
      </ApolloProvider>
    );

    return {
      getProps: () => injectedProps,
      wrapper
    };
  };

  describe('Successful scenarios', () => {
    beforeEach(() => {
      client = createApolloClient(resolversWithoutErrors);
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should pass render props correctly to the render function', async () => {
      const { getProps } = renderCheckoutLogic();
      expect(getProps().values).toBeDefined();
    });

    it('should properly set email when setEmail() method is called', async () => {
      const { getProps } = renderCheckoutLogic();
      await wait(0);
      getProps().setEmail('foo@bar.com');
      expect(getProps().values.email).toBe('foo@bar.com');
    });

    it('should properly set shipping address data when address is passed to setShippingAddress()', async () => {
      const { getProps } = renderCheckoutLogic();
      await wait(0);
      getProps().setShippingAddress(sampleAddress);
      await wait(0);
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
    });

    it('should properly set billing address data when address is passed to setBillingAddress()', async () => {
      const { getProps } = renderCheckoutLogic();
      await wait(0);
      getProps().setBillingAddress(sampleAddress);
      await wait(0);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
    });

    it('should properly set billing address data when setBillingSameAsShipping(true) is called', async () => {
      const { getProps } = renderCheckoutLogic();
      await wait(0);
      getProps().setShippingAddress(sampleAddress);
      getProps().setBillingSameAsShipping(true);
      await wait(0);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
    });

    it('should properly return available shipping options when shipping address is set', async () => {
      const { getProps } = renderCheckoutLogic();
      await wait(0);
      getProps().setShippingAddress(sampleAddress);
      await wait(0);
      expect(getProps().availableShippingMethods[0]).toEqual(sampleShippingMethod);
    });

    it('should properly return available payment options when shipping method is set', async () => {
      const { getProps } = renderCheckoutLogic();
      await wait(0);
      getProps().setShippingMethod(sampleShippingMethod);
      await wait(0);
      expect(getProps().availablePaymentMethods[0]).toEqual(samplePaymentMethod);
    });

    it('should properly return orderId when order was placed', async () => {
      const { getProps } = renderCheckoutLogic();
      await wait(0);
      getProps().setEmail('foo@bar.com');
      getProps().setShippingAddress(sampleAddress);
      getProps().setBillingSameAsShipping(true);
      getProps().setShippingMethod(sampleShippingMethod);
      getProps().setPaymentMethod(samplePaymentMethod);
      getProps().placeOrder();
      await wait(0);
      expect(getProps().orderId).toBe(10);
    });
  });

  describe('Error scenarios', () => {
    beforeEach(() => {
      client = createApolloClient(resolversWithErrors);
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should pass errors passed from backend for setShippingAddress', async () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setShippingAddress(sampleAddress);
      await wait(0);
      expect(getProps().errors.shippingAddress).toBeDefined();
    });

    it('should pass errors passed from backend for setShipping', async () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setShippingMethod(sampleShippingMethod);
      await wait(0);
      expect(getProps().errors.shippingMethod).toBeDefined();
    });

    it('should pass errors passed from backend for placeOrder', async () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setPaymentMethod(samplePaymentMethod);
      getProps().placeOrder();
      await wait(0);
      expect(getProps().errors.order).toBeDefined();
    });

    it('should reset availableShippingMethods when setShippingAddress returns error', async () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setShippingAddress(sampleAddress);
      await wait(0);
      expect(getProps().availableShippingMethods).toBe(null);
    });
  });

  describe('Loading states', () => {
    beforeEach(() => {
      client = createApolloClient(resolversWithoutErrors);
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should set loading flag to true when setShippingAddress mutation starts', async () => {
      const { getProps } = renderCheckoutLogic();
      expect(getProps().loading).toBe(false);
      getProps().setShippingAddress(sampleAddress);
      expect(getProps().loading).toBe(true);
      await wait(0);
      expect(getProps().loading).toBe(false);
    });

    it('should set loading flag to true when setShippingMethod mutation starts', async () => {
      const { getProps } = renderCheckoutLogic();
      expect(getProps().loading).toBe(false);
      getProps().setShippingMethod(sampleShippingMethod);
      expect(getProps().loading).toBe(true);
      await wait(0);
      expect(getProps().loading).toBe(false);
    });

    it('should set loading flag to true when placeOrder mutation starts', async () => {
      const { getProps } = renderCheckoutLogic();
      expect(getProps().loading).toBe(false);
      getProps().setPaymentMethod(samplePaymentMethod);
      getProps().placeOrder();
      expect(getProps().loading).toBe(true);
      await wait(0);
      expect(getProps().loading).toBe(false);
    });
  });
});
