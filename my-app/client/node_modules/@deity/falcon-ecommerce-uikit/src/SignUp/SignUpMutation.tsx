import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: SignUp!) {
    signUp(input: $input)
  }
`;

export type SignUpVariables = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  autoSignIn?: boolean;
};

type SignUpMutationVariables = {
  input: SignUpVariables;
};

export class SignUpMutation extends Mutation<boolean, SignUpMutationVariables> {
  static defaultProps = {
    mutation: SIGN_UP_MUTATION,
    awaitRefetchQueries: true,
    refetchQueries: ['Customer', 'MiniAccount', 'Cart']
  };
}
