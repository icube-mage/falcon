import gql from 'graphql-tag';
import { Query } from '../Query/Query';
import { Customer } from '../Customer';

const GET_MINI_ACCOUNT = gql`
  query MiniAccount {
    customer {
      id
      firstname
      lastname
      email
    }
  }
`;

export type MiniAccountData = {
  customer: Customer;
};

export class MiniAccountQuery extends Query<MiniAccountData> {
  static defaultProps = {
    query: GET_MINI_ACCOUNT
  };
}
