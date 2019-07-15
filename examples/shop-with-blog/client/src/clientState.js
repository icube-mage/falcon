import { GET_SIDEBAR_STATE } from './pages/shop/components/Sidebar';
/**
 * Defines client-side state resolvers
 */

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
  },
  {
    name: 'Name ascending',
    field: 'name',
    direction: 'asc'
  },
  {
    name: 'Name descending',
    field: 'name',
    direction: 'desc'
  }
];

export default {
  defaults: {
    sidebar: {
      contentType: null,
      side: 'right',
      isOpen: false
    }
  },

  resolvers: {
    Query: {
      sortOrders: () => sortOrders
    },

    Mutation: {
      openSidebar: (_, { contentType, side }, { cache }) => {
        const data = {
          sidebar: {
            contentType,
            side: side || 'right',
            isOpen: true
          }
        };

        cache.writeQuery({ query: GET_SIDEBAR_STATE, data });

        return null;
      },

      closeSidebar: (_, _variables, { cache }) => {
        const queryResponse = cache.readQuery({ query: GET_SIDEBAR_STATE });
        const sidebar = { ...queryResponse.sidebar };
        sidebar.isOpen = false;

        cache.writeQuery({
          query: GET_SIDEBAR_STATE,
          data: { sidebar }
        });

        return null;
      }
    }
  }
};
