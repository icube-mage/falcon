import gql from 'graphql-tag';
import { Query } from '../Query';

export type Menu = {
  menu: MenuItem[];
};

export type MenuItem = {
  id: string;
  name: string;
  urlPath: string;
  cssClass?: string;
  children: MenuItem[];
};

export const GET_MENU = gql`
  query Menu {
    menu {
      id
      name
      urlPath
      cssClass
      children {
        id
        name
        urlPath
        cssClass
        children {
          id
          name
          urlPath
          cssClass
        }
      }
    }
  }
`;

export class MenuQuery extends Query<Menu> {
  static defaultProps = {
    query: GET_MENU
  };
}
