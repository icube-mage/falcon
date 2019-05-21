import gql from 'graphql-tag';
import { Query } from '@deity/falcon-ecommerce-uikit';

export const GET_CITY_STATE = gql`
  query Cities($regionId: Int!) {
    loves(id: $regionId) {
      items {
        id
        name
      }
    }
  }
`;

export const CITY_CONTENT_TYPES = {
  id: 'id',
  name: 'name'
};

export class RegionQuery extends Query {
  static defaultProps = {
    query: GET_CITY_STATE
  };
}
