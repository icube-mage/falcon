import { apolloStateToObject } from './apolloStateToObject';

describe('ApolloClient', () => {
  describe('apolloStateToObject', () => {
    it('Should correctly expand nested object', () => {
      const testStateObj = {
        root: {
          foo: {
            generated: true,
            id: 'foo'
          }
        },
        foo: {
          bar: true
        }
      };
      expect(apolloStateToObject(testStateObj, 'root')).toEqual({
        foo: {
          bar: true
        }
      });
    });

    it('Should correctly process Array value', () => {
      const testStateObj = {
        root: {
          foo: {
            generated: true,
            id: 'foo'
          }
        },
        foo: {
          list: {
            json: [1, 2],
            type: 'json'
          }
        }
      };
      expect(apolloStateToObject(testStateObj, 'root')).toEqual({
        foo: {
          list: [1, 2]
        }
      });
    });

    it('Should handle simple value', () => {
      const testStateObj = {
        root: {
          foo: false
        }
      };
      expect(apolloStateToObject(testStateObj, 'root')).toEqual({
        foo: false
      });
    });

    it('Should handle unset value', () => {
      expect(apolloStateToObject({}, '')).toEqual({});
    });

    it('Should handle undefined key value', () => {
      const testStateObj = {
        root: {
          foo: {
            generated: true,
            id: 'foo'
          }
        },
        foo: {
          list: undefined
        }
      };
      expect(apolloStateToObject(testStateObj, 'root')).toEqual({
        foo: {}
      });
    });

    it('Should handle null key value', () => {
      const testStateObj = {
        root: {
          foo: {
            generated: true,
            id: 'foo'
          }
        },
        foo: {
          list: null
        }
      };
      expect(apolloStateToObject(testStateObj, 'root')).toEqual({
        foo: {
          list: null
        }
      });
    });
  });
});
