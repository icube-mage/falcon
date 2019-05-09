import gql from 'graphql-tag';
import { Query } from '../Query/Query';
import { AddressData } from './../Address';

export const GET_CUSTOMER = gql`
  query Customer {
    customer {
      id
      firstname
      lastname
      email
      websiteId
    }
  }
`;

export type Customer = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  websiteId: number;
  addresses?: AddressData[];
};

export type CustomerQueryData = {
  customer: Customer;
};

export class CustomerQuery extends Query<CustomerQueryData> {
  static defaultProps = {
    query: GET_CUSTOMER
  };
  static propTypes = {
    ...Query.propTypes
  };
}

export const GET_CUSTOMER_WITH_ADDRESSES = gql`
  query CustomerWithAddresses {
    customer {
      id
      firstname
      lastname
      email
      addresses {
        id
        company
        firstname
        lastname
        street
        postcode
        city
        countryId
        defaultBilling
        defaultShipping
        region
        regionId
        telephone
      }
    }
  }
`;

export class CustomerWithAddressesQuery extends Query<Customer> {
  static defaultProps = {
    query: GET_CUSTOMER_WITH_ADDRESSES
  };
}
