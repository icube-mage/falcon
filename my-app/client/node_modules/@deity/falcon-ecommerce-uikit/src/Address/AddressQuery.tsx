import gql from 'graphql-tag';
import { Query } from '../Query';

export type AddressData = {
  id: number;
  company?: string;
  firstname: string;
  lastname: string;
  telephone?: string;
  fax?: string;
  street: string[];
  postcode: string;
  city: string;
  region?: string;
  regionId?: number;
  countryId: string;
  defaultBilling: boolean;
  defaultShipping: boolean;
};

export const GET_ADDRESS = gql`
  query Address($id: Int!) {
    address(id: $id) {
      id
      firstname
      lastname
      telephone
      street
      city
      postcode
      region
      regionId
      countryId
      company
      defaultBilling
      defaultShipping
    }
  }
`;
export class AddressQuery extends Query<AddressData> {
  static defaultProps = {
    query: GET_ADDRESS
  };
}

export type AddressesListData = {
  addresses: {
    items: AddressData[];
  };
};

export const GET_ADDRESSES_LIST = gql`
  query Addresses {
    addresses {
      items {
        id
        firstname
        lastname
        telephone
        street
        city
        postcode
        region
        regionId
        countryId
        company
        defaultBilling
        defaultShipping
      }
    }
  }
`;

export class AddressesListQuery extends Query<AddressesListData> {
  static defaultProps = {
    query: GET_ADDRESSES_LIST
  };
}
