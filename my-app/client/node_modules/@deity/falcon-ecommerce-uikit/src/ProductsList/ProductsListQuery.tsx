import gql from 'graphql-tag';
import { Query } from '../Query';

export const GET_PRODUCTS_LIST = gql`
  query Products {
    products {
      items {
        id
        name
        price
        thumbnail
        urlPath
      }
    }
  }
`;

export type Products = {
  items: any[];
};

export class ProductsListQuery extends Query<Products> {
  static defaultProps = {
    query: GET_PRODUCTS_LIST
  };
}
