import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter, Route, RouteComponentProps } from 'react-router-dom';
import { mockSingleLink } from 'react-apollo/test-utils';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache as Cache } from 'apollo-cache-inmemory';
import { SearchProvider, SORT_ORDERS_QUERY } from './SearchProvider';
import { SearchContext, SearchContextType } from './SearchContext';
import { SearchState } from './types';
import { wait } from '../../../../test/helpers';

// custom serializing and deserializing go avoid problems when default implementation of those changes
const stateToUrl = (state: SearchState) => JSON.stringify(state);
const stateFromUrl = (url: string) => (url ? JSON.parse(url.replace('?', '')) : {});

const sortOrders = [
  {
    name: 'Price ascending',
    field: 'price',
    direction: 'asc'
  },
  {
    name: 'Price descending',
    field: 'price',
    direction: 'desc'
  }
];

describe('SearchProvider', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let searchInfo: SearchContextType;

  // mounts all the required pieces (router, route, mocked apollo and search provider) and returns wrapper with all elements
  const renderSearchProvider = async (ContentComponent: any = null) => {
    const client = new ApolloClient({
      link: mockSingleLink(),
      cache: new Cache({ addTypename: false }).restore({
        ROOT_QUERY: {
          sortOrders
        }
      })
    });

    wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <ApolloProvider client={client}>
          <Route>
            <SearchProvider searchStateFromURL={stateFromUrl} searchStateToURL={stateToUrl}>
              <SearchContext.Consumer>
                {search => {
                  searchInfo = search;
                  return ContentComponent ? <ContentComponent search={search} /> : null;
                }}
              </SearchContext.Consumer>
            </SearchProvider>
          </Route>
        </ApolloProvider>
      </MemoryRouter>
    );

    // wait for Query to be executed
    await wait(0);
  };

  const getLocation = () =>
    (wrapper!.find((SearchProvider as any).WrappedComponent).props() as RouteComponentProps).location;
  const getSearchInfo = () => wrapper!.find((SearchProvider as any).WrappedComponent).state();

  beforeEach(async () => {
    await renderSearchProvider();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  it('should provide info about search via context', async () => {
    expect(searchInfo).not.toBeUndefined();
  });

  it('setFilter() should update url and pass new filter value in props', async () => {
    searchInfo.setFilter('price', ['10']);
    wrapper!.update();
    expect(searchInfo.state.filters).toHaveLength(1);
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('removeFiler() should update url and remove filter value from passed props', async () => {
    searchInfo.setFilter('price', ['10']);
    searchInfo.removeFilter('price');
    wrapper!.update();
    expect(searchInfo.state.filters).toHaveLength(0);
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('setQuery() should update url and pass query in props', async () => {
    searchInfo.setQuery('searchQuery');
    searchInfo.removeFilter('price');
    wrapper!.update();
    expect(searchInfo.state.query).toEqual('searchQuery');
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('setSortOrder() should update url and pass order in props', async () => {
    searchInfo.setSortOrder({ field: 'price', direction: 'asc' as any });
    wrapper!.update();
    // name: 'Price ascending' should be added as value passed to setSortOrder is matched with value from
    // sortOrders property passed to SearchProvider (from Query or via prop directly)
    expect(searchInfo.state.sort).toEqual({ field: 'price', direction: 'asc', name: 'Price ascending' });
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('setPagination() should update url and pass pagination in props', async () => {
    searchInfo.setPagination({ page: 1, perPage: 10 });
    wrapper!.update();
    expect(searchInfo.state.pagination).toEqual({ page: 1, perPage: 10 });
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('history change should trigger update of search state', async () => {
    const { history } = wrapper!.find((SearchProvider as any).WrappedComponent).props() as RouteComponentProps;
    history.push('/?{"query":"foo"}');
    wrapper!.update();
    expect(searchInfo.state.query).toEqual('foo');
  });
});
