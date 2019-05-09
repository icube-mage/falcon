import gql from 'graphql-tag';
import { Query } from '../Query/Query';

export const GET_URL = gql`
  query Url($path: String!) {
    url(path: $path) {
      type
      redirect
      id
      path
    }
  }
`;

export type DynamicUrl = {
  type: string;
  redirect?: boolean;
  id: string;
  path: string;
};

export type UrlQueryVariables = { path: string };
export type UrlQueryData = { url: DynamicUrl };
export class UrlQuery extends Query<UrlQueryData, UrlQueryVariables> {
  static defaultProps = {
    query: GET_URL
  };
  static propTypes = {
    ...Query.propTypes
  };
}
