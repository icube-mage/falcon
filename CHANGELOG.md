# CHANGELOG

**Note:** This is a cumulative changelog that outlines all of the changes to all the packages from [packages](./packages) folder.

Versions marked with a number and date (e.g. Falcon Client v0.1.0 (2018-10-05)) are already released and available via npm. Versions without a date are not released yet.

## Falcon 1.0 RC (2019-02-14)

### Falcon Shop Extension v0.3.0 (2019-02-14)

- updated schema to handle filters correctly ([#309](https://github.com/deity-io/falcon/pull/309))

### Falcon Magento2 API v0.3.0 (2019-02-14)

- added filters implementation ([#309](https://github.com/deity-io/falcon/pull/309))
- updated endpoint for placing order so it's compatible with falcon-magento2-module v3.0.0
- added fetching of dynamic menu ([#280](https://github.com/deity-io/falcon/pull/280))

### Falcon E-commerce UI Kit v0.3.0 (2019-02-14)

- added `SearchProvider` with `SearchContext` that handles basic filtering ([#309](https://github.com/deity-io/falcon/pull/309))
- added handling of dynamic menu ([#280](https://github.com/deity-io/falcon/pull/280))

### Falcon Client v0.3.0 (2019-02-14)

- fixed offline mode ([#266](https://github.com/deity-io/falcon/pull/266))

### Falcon Server v0.3.0 (2019-02-14)

- fixed missing dependencies (`core-js`) issue ([#313](https://github.com/deity-io/falcon/pull/313))

---

## Falcon v0.3 (2019-01-18)

### Falcon Client v0.2.0 (2019-01-18)

- improvement: React 16.6 support ([#226](https://github.com/deity-io/falcon/pull/226))
- added support for scss with css modules ([#259](https://github.com/deity-io/falcon/pull/259))

### Falcon Server v0.1.1 (2019-01-18)

- refactor: `Events` enum has been moved from `falcon-server` to `falcon-server-env` package ([#146](https://github.com/deity-io/falcon/pull/146))

### Falcon Magento2 API v0.2.0 (2019-01-18)

- changed url resolver to use new format of data sent by `/url` endpoint ([#146](https://github.com/deity-io/falcon/pull/146))
- added support for fetching breadcrumbs from new endpoint ([#146](https://github.com/deity-io/falcon/pull/146))
- added support for product list sorting ([#146](https://github.com/deity-io/falcon/pull/146))
- modified fetching of category products - now it uses `/categories/{id}/products` endpoint ([#146](https://github.com/deity-io/falcon/pull/146))
- added aggregations parsing for ProductList ([#146](https://github.com/deity-io/falcon/pull/146))

### Falcon UI v0.2.0 (2019-01-18)

- feat: added `Menu` component ([#240](https://github.com/deity-io/falcon/pull/240))

### Falcon E-commerce UI Kit v0.2.0 (2019-01-18)

- feat: added queries and mutations for:
  - getting all orders and by id
  - addresses operations (add new address, remove address, change address)
  - editing customer information and changing password ([#240](https://github.com/deity-io/falcon/pull/240))
- feat: added `CheckboxFormField` ([#240](https://github.com/deity-io/falcon/pull/240))
- improvement: extracted `Field` component in order to improve support for custom `FormField`'s component ([#240](https://github.com/deity-io/falcon/pull/240))
- added `SortOrderProvider` which handles fetching and setting sort options for product lists ([#146](https://github.com/deity-io/falcon/pull/146))

### Falcon Shop Extension v0.2.0 (2019-01-18)

- feat: introduced resolver `addresses: AddressList` in order to retrieve all customer addresses, added types `EditAddressInput`, `AddAddressInput` ([#240](https://github.com/deity-io/falcon/pull/240))

---

## Falcon v0.2 (2018-12-12)

### Falcon Client v0.1.0 (2018-12-12)

- feat: support for Google Analytics added ([#78](https://github.com/deity-io/falcon/pull/78))
- improvement: removed razzle ([#87](https://github.com/deity-io/falcon/pull/87))
- feat: added translations for common app areas (except checkout) ([#205](https://github.com/deity-io/falcon/pull/205))

### Falcon Server v0.1.0 (2018-12-12)

- feat: Basic Cache implementation was introduced ([#176](https://github.com/deity-io/falcon/pull/176))
- feat: (Breaking change) changed Event flow for ApiContainer and its entries - every ApiDataSource instance is being
  created on GQL request ([#176](https://github.com/deity-io/falcon/pull/176))
- feat: added `backendConfig` Query type ([#176](https://github.com/deity-io/falcon/pull/176))
- feat: `type BackendConfig`, `enum SortOrderDirection`, `input SortOrderInput` were introduced in the base Schema ([#176](https://github.com/deity-io/falcon/pull/176))
- fix: added separate `endpoints` config section and dedicated base class ([#176](https://github.com/deity-io/falcon/pull/176))
- refactor: `Events` enum has been moved from `falcon-server` to `falcon-server-env` package ([#176](https://github.com/deity-io/falcon/pull/176))

### Falcon UI v0.1.0 (2018-12-12)

- docs: comprehensive documentation added ([#115](https://github.com/deity-io/falcon/pull/115))
- feat: support for keyframe animations defined in theme ([#153](https://github.com/deity-io/falcon/pull/153))

### Falcon Theme Editor v0.1.0 (2018-12-12)

- feat: inspect mode, more props, improved performance, layout tweaks ([#115](https://github.com/deity-io/falcon/pull/115))

### Falcon E-commerce UI Kit v0.1.0 (2018-12-12)

- feat: basic blog UI (listing posts, displaying single post) ([#137](https://github.com/deity-io/falcon/pull/137))
- feat: added queries and mutations for cart operations (add to cart, remove from cart, change cart item) ([#114](https://github.com/deity-io/falcon/pull/114))
- feat: added queries and mutations for sign in / sign out operations ([#152](https://github.com/deity-io/falcon/pull/152))
- feat: added `ProtectedRoute` and `OnlyUnauthenticatedRoute` route components ([#163](https://github.com/deity-io/falcon/pull/163))
- feat: added queries and mutations for checkout process and implemented checkout logic abstraction ([#182](https://github.com/deity-io/falcon/pull/182))
- feat: added `Form` component which provides translation context for `FormField`s ([#205](https://github.com/deity-io/falcon/pull/205))

### Create Falcon App v1.1.1 (2018-12-12)

- feat: allow ejecting `falcon-ecommerce-uikit` package via `eject` command ([#212](https://github.com/deity-io/falcon/pull/212))

### Create Falcon App v1.0.7 (2018-10-25)

- docs: updated documentation ([#47](https://github.com/deity-io/falcon/pull/47))
- fix: fixed problem with React 16.6.0 ([#109](https://github.com/deity-io/falcon/pull/109))

### Falcon Server Env v0.1.0 (2018-12-12)

- feat: Provided `Cache` wrapper class and built-in `InMemoryLRUCache` cache provider ([#176](https://github.com/deity-io/falcon/pull/176))
- feat: added getter and setter methods to work with "named" session object from the context in ApiDataSource
  ([#176](https://github.com/deity-io/falcon/pull/176))
- feat: `ApiDataSource` and `Extension` models are now accept `eventEmitter` instance
  ([#176](https://github.com/deity-io/falcon/pull/176))
- feat: Provided `EndpointManager` base class ([#176](https://github.com/deity-io/falcon/pull/176))
- feat: Base `Extension` class provides auto-binding for its own GraphQL Schema to the assigned ApiDataSource instance
  (via `getGraphQLConfig()` method) ([#176](https://github.com/deity-io/falcon/pull/176))

### Falcon Magento2 API v0.1.0 (2018-12-12)

- feat: Magento Admin token is now being stored in cache ([#176](https://github.com/deity-io/falcon/pull/176))

### eject-ts v0.1.0 (2018-12-12)

- feat: eject-ts CLI ([#212](https://github.com/deity-io/falcon/pull/212))

### Falcon-i18n v0.0.4

- feat: added `i18nProvider` with `I18n` and `T` components to ease internationalization support ([#205](https://github.com/deity-io/falcon/pull/205))

---

## Falcon v0.1 (2018-10-05)

### Falcon Client v0.0.1 (2018-10-05)

- feat: development and build process using razzle (https://github.com/jaredpalmer/razzle)
- feat: built in SSR
- feat: built in i18n
- feat: connection with Falcon Server via [Apollo Client](https://www.apollographql.com/docs/react/)
- feat: state management via [Apollo Link State](https://www.apollographql.com/docs/link/links/state.html)

### Falcon Server v0.0.1 (2018-10-05)

- feat: extensions system with built-in schema stitching
- feat: all the communication based on GraphQL (using [Apollo Server](https://www.apollographql.com/docs/apollo-server/))

### Falcon UI v0.0.1 (2018-10-05)

- feat: basic set of components with theming capabilities
- feat: first version of theme editor as React component

### Falcon E-commerce UI Kit v0.0.1 (2018-10-05)

- feat: product list view
- feat: product page view
- feat: mini cart view on sidebar

### Create Falcon App v1.0.0 (2018-10-05)

- feat: creating Falcon project from predefined template

### Falcon Shop Extension v0.0.1 (2018-10-05)

- feat: first version of schema for shop features

### Falcon Magento2 Api v0.0.1 (2018-10-05)

- feat: resolvers for Falcon Shop Extension used for communication with Magento2 shop

### Falcon Blog Extension v0.0.1 (2018-10-05)

- feat: first version of schema for blog features

### Falcon WordPress Api v0.0.1 (2018-10-05)

- feat: resolvers for Falcon Blog Extension used for communication with WordPress backend
