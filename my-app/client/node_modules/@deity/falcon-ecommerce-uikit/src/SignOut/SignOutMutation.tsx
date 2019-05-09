import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut
  }
`;

export class SignOutMutation extends Mutation {
  static defaultProps = {
    mutation: SIGN_OUT_MUTATION,
    awaitRefetchQueries: true,
    refetchQueries: ['Customer', 'MiniAccount', 'Cart']
  };
}
