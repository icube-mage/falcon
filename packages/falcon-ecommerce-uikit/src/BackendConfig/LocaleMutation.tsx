import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

export const SET_LOCALE = gql`
  mutation SetLocale($locale: String!) {
    setLocale(locale: $locale) {
      activeLocale
    }
  }
`;
export type SetLocaleData = {
  setLocale: {
    activeLocale: string;
  };
};

export class SetLocaleMutation extends Mutation<SetLocaleData, { locale: string }> {
  static defaultProps = {
    mutation: SET_LOCALE,
    awaitRefetchQueries: true,
    refetchQueries: ['BackendConfig']
  };
}
