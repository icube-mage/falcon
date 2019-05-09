import gql from 'graphql-tag';
import { Query } from '../Query/Query';

export const GET_CATEGORY_PRODUCTS = gql`
  query CategoryProducts(
    $categoryId: String!
    $sort: SortOrderInput
    $pagination: PaginationInput
    $filters: [FilterInput]
  ) {
    category(id: $categoryId) {
      name
      products(sort: $sort, pagination: $pagination, filters: $filters) {
        items {
          id
          name
          price
          thumbnail
          urlPath
        }
        pagination {
          currentPage
          totalItems
          nextPage
        }
        aggregations {
          key
          name
          buckets {
            name
            value
            count
          }
        }
      }
    }
  }
`;

const fetchMore = (data: any, apolloFetchMore: any) =>
  apolloFetchMore({
    variables: {
      pagination: {
        page: data.category.products.pagination.nextPage
      }
    },
    updateQuery: (prev: any, { fetchMoreResult }: any) => {
      if (!fetchMoreResult) {
        return prev;
      }

      return {
        ...prev,
        category: {
          ...prev.category,
          products: {
            ...prev.category.products,
            items: [...prev.category.products.items, ...fetchMoreResult.category.products.items],
            pagination: { ...fetchMoreResult.category.products.pagination }
          }
        }
      };
    }
  });

export class CategoryProductsQuery extends Query<any> {
  static defaultProps = {
    query: GET_CATEGORY_PRODUCTS,
    fetchMore,
    notifyOnNetworkStatusChange: true
  };
}
