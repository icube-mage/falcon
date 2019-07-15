import React from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { themeCategories, ThemeStateContext } from '@deity/falcon-theme-editor';
import { mappings, ResponsivePropMapping } from '../src/theme/responsiveprops';
import { Table, Thead, Tr, Th, Tbody, Td, Box, Icon } from '../src';

const mappingKeys = Object.keys(mappings);

const toKebabCase = (val: string) => val.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const ResponsiveProps: React.SFC<{ category: keyof typeof themeCategories }> = ({ category }) => (
  <Box>
    <Table>
      <Thead>
        <Tr>
          <Th>Property</Th>
          <Th>Meaning(CSS property)</Th>
          <Th>Available Values</Th>
        </Tr>
      </Thead>
      <Tbody>
        {themeCategories[category].themeSections.map(section =>
          mappingKeys
            .filter(name => (mappings[name] as ResponsivePropMapping).themeProp === section)
            .map(name => {
              const prop: ResponsivePropMapping = mappings[name];
              const cssProp = prop.cssProp || (!prop.transformToCss ? name : '');

              return (
                <Tr key={name}>
                  <Td fontWeight="bold">{name}</Td>

                  <Td>
                    {cssProp && toKebabCase(cssProp)}
                    {!cssProp && (
                      <Box color="primary" title={prop.transformToCss.toString()}>
                        transform function
                      </Box>
                    )}
                  </Td>
                  <Td>
                    <ThemeStateContext.Consumer>
                      {({ openThemePropsPanel }) => (
                        <Box css={{ cursor: 'pointer' }} onClick={() => openThemePropsPanel(category, section)}>
                          <Icon size="md" src="viewTheme" />
                        </Box>
                      )}
                    </ThemeStateContext.Consumer>
                  </Td>
                </Tr>
              );
            })
        )}
      </Tbody>
    </Table>
  </Box>
);

export default withMDXComponents(ResponsiveProps);
