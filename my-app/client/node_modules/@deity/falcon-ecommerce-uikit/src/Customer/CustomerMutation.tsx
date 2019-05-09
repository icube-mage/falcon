import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const EDIT_CUSTOMER = gql`
  mutation EditCustomer($input: CustomerInput!) {
    editCustomer(input: $input) {
      id
    }
  }
`;
export class EditCustomerMutation extends Mutation {
  static defaultProps = {
    mutation: EDIT_CUSTOMER,
    awaitRefetchQueries: true,
    refetchQueries: ['Customer', 'CustomerWithAddresses']
  };
}
