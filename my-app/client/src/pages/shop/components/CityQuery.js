import gql from 'graphql-tag';
import { Query } from '@deity/falcon-ecommerce-uikit';

export const GET_KECAMATANS_STATE = gql`
  query Kecamatans($cityId: String!) {
    kecamatans(id: $cityId) {
      items {
        id
        name
      }
    }
  }
`;

export const KECAMATANS_CONTENT_TYPES = {
  id: 'id',
  name: 'name'
};

export class CityQuery extends Query {
  static defaultProps = {
    query: GET_KECAMATANS_STATE
  };
}
