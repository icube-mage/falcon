import gql from 'graphql-tag';
import { Query } from '../Query';

export const VALIDATE_PASSWORD_TOKEN_QUERY = gql`
  query ValidatePasswordToken($token: String!) {
    validatePasswordToken(token: $token)
  }
`;

export class ValidatePasswordTokenQuery extends Query<{ validatePasswordToken: boolean }, { token: string }> {
  static defaultProps = {
    query: VALIDATE_PASSWORD_TOKEN_QUERY
  };
}
