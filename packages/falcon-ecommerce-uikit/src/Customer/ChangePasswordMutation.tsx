import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const CHANGE_PASSWORD = gql`
  mutation changePassword($input: CustomerPassword!) {
    changeCustomerPassword(input: $input)
  }
`;
export class ChangePasswordMutation extends Mutation {
  static defaultProps = {
    mutation: CHANGE_PASSWORD
  };
}
