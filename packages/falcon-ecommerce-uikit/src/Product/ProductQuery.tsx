import gql from 'graphql-tag';
import { Query } from '../Query';

export const GET_PRODUCT = gql`
  query Product($id: String!, $path: String!) {
    product(id: $id) {
      id
      sku
      name
      description
      price
      currency
      gallery {
        full
        thumbnail
      }
      configurableOptions {
        id
        attributeId
        label
        productId
        values {
          valueIndex
          label
          inStock
        }
      }
      seo {
        title
        description
        keywords
      }
      breadcrumbs(path: $path) {
        name
        urlPath
      }
    }
  }
`;

export class ProductQuery extends Query<any> {
  static defaultProps = {
    query: GET_PRODUCT
  };
}
