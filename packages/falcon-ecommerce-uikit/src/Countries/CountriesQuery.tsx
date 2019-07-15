import gql from 'graphql-tag';
import { Query } from './../Query';

export type Country = {
  englishName: string;
  localName: string;
  code: string;
};

export type CountriesData = {
  items: Country[];
};

export const GET_COUNTRIES = gql`
  query Countries {
    countries {
      items {
        englishName
        localName
        code
      }
    }
  }
`;

export class CountriesQuery extends Query<CountriesData> {
  static defaultProps = {
    query: GET_COUNTRIES
  };
}
