import gql from 'graphql-tag';
import { Query } from '../Query';

export type BackendConfig = {
  locales: string[];
  activeLocale: string;
  shop: {
    activeCurrency: string;
  };
};

export const GET_BACKEND_CONFIG = gql`
  query BackendConfig {
    backendConfig {
      locales
      activeLocale
      shop {
        activeCurrency
      }
    }
  }
`;
export class BackendConfigQuery extends Query<{ backendConfig: BackendConfig }> {
  static defaultProps = {
    query: GET_BACKEND_CONFIG
  };
}
