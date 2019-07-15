const { mockServer } = require('graphql-tools');
const { EventEmitter2 } = require('eventemitter2');
const ExtensionContainer = require('./ExtensionContainer');
const { BaseSchema } = require('../index');

const extensions = {
  shop: {
    package: 'fake-shop-extension',
    config: {
      apiUrl: 'https://example.com'
    }
  },
  reviews: {
    package: 'fake-product-reviews-extension'
  }
};

const mocks = {
  Product: () => ({
    id: 1,
    name: 'test product'
  }),

  Review: () => ({
    id: 2,
    content: 'review content'
  })
};

describe('ExtensionContainer', () => {
  let container;
  let ee;

  beforeEach(async () => {
    ee = new EventEmitter2();
    container = new ExtensionContainer(ee);
    await container.registerExtensions(extensions);
  });

  it('Should correctly load extensions passed in configuration', async () => {
    expect(container.extensions.size).toEqual(2);
  });

  it('Should correctly pass configuration to extensions', () => {
    expect(container.extensions.get('shop').config.apiUrl).toEqual('https://example.com');
  });

  it('Should merge objects', () => {
    const testCases = [
      [
        [
          {
            locales: ['en-US']
          },
          {
            locales: ['pl-PL']
          }
        ],
        {
          locales: []
        }
      ],
      [
        [
          {
            locales: ['en-US', 'nl-NL']
          },
          {
            locales: ['pl-PL', 'en-US']
          }
        ],
        {
          locales: ['en-US']
        }
      ],
      [
        [
          {
            foo: 'bar'
          },
          {
            locales: ['pl-PL', 'en-US']
          },
          null
        ],
        {
          locales: ['pl-PL', 'en-US']
        }
      ]
    ];

    testCases.forEach(([incoming, expected]) => {
      expect(container.mergeConfigs(incoming)).toEqual(expected);
    });
  });

  describe('Schema stitching', () => {
    it('Should not throw errors during GraphQL config computing', () => {
      expect(async () => {
        await container.createGraphQLConfig({
          schemas: [BaseSchema]
        });
      }).not.toThrow();
    });

    it('Should produce proper schema from schemas returned by extensions', async () => {
      const query = `
        {
          __type(name: "Product") {
            name
            fields {
              name
            }
          }
        }
      `;
      const { schema } = await container.createGraphQLConfig({
        schemas: [BaseSchema]
      });
      const server = mockServer(schema, mocks);
      const result = await server.query(query);
      expect(result.data.__type.fields.length).toEqual(3); // eslint-disable-line no-underscore-dangle
    });
  });
});
