import gql from 'graphql-tag';
import { Query } from '../Query/Query';

export const GET_IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    customer {
      id
    }
  }
`;

export type IsAuthenticatedQueryData = {
  customer: { id: number };
};

export class IsAuthenticatedQuery extends Query<IsAuthenticatedQueryData> {
  static defaultProps = {
    query: GET_IS_AUTHENTICATED
  };
  static propTypes = {
    ...Query.propTypes
  };
}
