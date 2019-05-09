import qs from 'qs';
import { SearchState } from './types';

type UrlParts = {
  // search query
  q?: string;
  // search filters - key/value map
  filters?: { [key: string]: string };
  // current page
  p?: string;
  // items per page
  pp?: string;
  // sort order
  sort?: string;
};

export function searchStateToURL(state: SearchState) {
  const { query, filters, sort, pagination } = state;

  const parts: UrlParts = {};

  if (filters) {
    parts.filters = {};
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      const name = filter.operator === 'eq' ? filter.field : `${filter.field}:${filter.operator}`;
      parts.filters[name] = filter.value.join(',');
    }
  }

  if (sort && sort.field && sort.direction) {
    parts.sort = `${sort.field}:${sort.direction}`;
  }

  if (pagination) {
    parts.pp = pagination.perPage.toString();
    parts.p = pagination.page.toString();
  }

  if (query) {
    parts.q = query; // eslint-disable-line id-length
  }

  return qs.stringify(parts, { encode: false });
}
