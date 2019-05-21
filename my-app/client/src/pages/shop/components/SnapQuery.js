import gql from 'graphql-tag';
import { Query } from '@deity/falcon-ecommerce-uikit';

export const GET_SNAP_TOKEN_STATE = gql`
  query SnapToken($orderId: Int!) {
    snapToken(id: $orderId) {
      name
      quoteId
    }
  }
`;

export const SNAP_TOKEN_CONTENT_TYPES = {
  name: 'name',
  quoteId: 'quoteId'
};

export class SnapQuery extends Query {
  static defaultProps = {
    query: GET_SNAP_TOKEN_STATE
  };
}
