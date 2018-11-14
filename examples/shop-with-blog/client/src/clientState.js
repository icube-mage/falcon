import gql from 'graphql-tag';

/**
 * Defines client-side state resolvers
 */

const languages = [
  {
    name: 'English',
    code: 'en',
    active: false
  },
  {
    name: 'Dutch',
    code: 'nl',
    active: true
  }
];

const sortOrders = [
  {
    name: 'Price ascending',
    id: 'asc',
    active: true
  },
  {
    name: 'Price descending',
    id: 'desc'
  }
];

const GET_MINI_CART_STATE = gql`
  query MiniCartState {
    miniCart @client {
      open
    }
  }
`;

export default {
  defaults: {
    miniCart: {
      open: false
    },
    miniAccount: {
      open: false
    },
    // todo: this is temporary, these values should be fetched from shop settings
    localeSettings: {
      locale: 'en',
      currency: 'EUR'
    }
  },

  resolvers: {
    Query: {
      languages: () => languages,
      sortOrders: () => sortOrders,

      // todo: this resolver makes sure, that when refetchQuery is refreshing also miniCart its state will
      // be loaded from cache, not from defaults as we don't want the refetch mechanism to toggle miniCart
      miniCart: (_, _variables, { cache }) => {
        const { miniCart } = cache.readQuery({
          query: GET_MINI_CART_STATE
        });
        return miniCart;
      }
    },

    Mutation: {
      toggleMiniCart: (_, _variables, { cache }) => {
        const { miniCart } = cache.readQuery({ query: GET_MINI_CART_STATE });

        cache.writeQuery({
          query: GET_MINI_CART_STATE,
          data: { miniCart: { open: !miniCart.open } }
        });

        return null;
      },
      toggleMiniAccount: (_, _variables, { cache }) => {
        const query = gql`
          query MiniAccount {
            miniAccount @client {
              open
            }
          }
        `;

        const { miniAccount } = cache.readQuery({ query });
        cache.writeQuery({
          query,
          data: { miniAccount: { open: !miniAccount.open } }
        });

        return null;
      }
    }
  }
};
