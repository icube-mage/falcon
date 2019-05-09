import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const EDIT_ADDRESS = gql`
  mutation EditAddress($input: EditAddressInput!) {
    editAddress(input: $input) {
      id
    }
  }
`;
export class EditAddressMutation extends Mutation {
  static defaultProps = {
    mutation: EDIT_ADDRESS,
    awaitRefetchQueries: true,
    refetchQueries: ['Addresses']
  };
}

export const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddAddressInput!) {
    addAddress(input: $input) {
      id
    }
  }
`;
export class AddAddressMutation extends Mutation {
  static defaultProps = {
    mutation: ADD_ADDRESS,
    awaitRefetchQueries: true,
    refetchQueries: ['Addresses']
  };
}

export const REMOVE_ADDRESS = gql`
  mutation RemoveAddress($id: Int!) {
    removeCustomerAddress(id: $id)
  }
`;
export class RemoveAddressMutation extends Mutation {
  static defaultProps = {
    mutation: REMOVE_ADDRESS,
    awaitRefetchQueries: true,
    refetchQueries: ['Addresses']
  };
}
