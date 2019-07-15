import { Query } from '@deity/falcon-ecommerce-uikit';
import _inheritsLoose from '../../../node_modules/@babel/runtime/helpers/esm/inheritsLoose';
import _defineProperty from '../../../node_modules/@babel/runtime/helpers/esm/defineProperty';

export const GET_COUNTRIES = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: {
        kind: 'Name',
        value: 'Countries'
      },
      variableDefinitions: [],
      directives: [],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: {
              kind: 'Name',
              value: 'countries'
            },
            arguments: [],
            directives: [],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: {
                    kind: 'Name',
                    value: 'items'
                  },
                  arguments: [],
                  directives: [],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'englishName'
                        },
                        arguments: [],
                        directives: []
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'localName'
                        },
                        arguments: [],
                        directives: []
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'code'
                        },
                        arguments: [],
                        directives: []
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'regions'
                        },
                        arguments: [],
                        directives: [],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'id'
                              },
                              arguments: [],
                              directives: []
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'code'
                              },
                              arguments: [],
                              directives: []
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'name'
                              },
                              arguments: [],
                              directives: []
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'name'
                              },
                              arguments: [],
                              directives: []
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ],
  loc: {
    start: 0,
    end: 120,
    source: {
      body:
        '\n  query Countries {\n    countries {\n      items {\n        englishName\n        localName\n        code\n      regions {\n          id\n          code\n          localName: name\n        englishName: name\\n        }\n   }\n    }\n  }\n',
      name: 'GraphQL request',
      locationOffset: {
        line: 1,
        column: 1
      }
    }
  }
};
export const CountriesQuery =
  /* #__PURE__ */
  (function(_Query) {
    _inheritsLoose(CountriesQuery, _Query);

    function CountriesQuery() {
      return _Query.apply(this, arguments) || this;
    }

    return CountriesQuery;
  })(Query);

_defineProperty(CountriesQuery, 'defaultProps', {
  query: GET_COUNTRIES
});
// # sourceMappingURL=CountriesQuery.js.map
