import React from 'react';

import {
  Theme,
  mappings,
  ThemedComponentPropsWithVariants,
  mergeThemes,
  Box,
  Dropdown,
  DropdownLabel,
  DropdownMenu,
  DropdownMenuItem,
  GridLayout,
  ResponsivePropMapping,
  Text,
  H3,
  Input
} from '@deity/falcon-ui';

import { themeMeta } from './thememeta';
import { ComponentWithDefaultTheme } from '.';

function keys<O>(object: O) {
  return Object.keys(object) as (keyof O)[];
}

type ComponentEditorProps = {
  theme: Theme;
  defaultThemeProps: ThemedComponentPropsWithVariants;
  themeProps?: ThemedComponentPropsWithVariants;
  onChange: (key: string, value: string | object) => void;
};

type ThemedPropEditorProps = {
  onChange: (key: string, value: string) => void;
  themeProp: keyof Theme;
  themeSection: {
    [name: string]: any;
  };
  propValue: string; // wartosc ustawiona obecnie w theme
  propKey: string;
};

const ThemedPropEditor: React.SFC<ThemedPropEditorProps> = ({
  themeProp,
  themeSection,
  onChange,
  propKey,
  propValue
}) => {
  const meta = themeMeta[themeProp];
  if (!meta) return null;

  return (
    <Dropdown onChange={value => onChange(value.key, value.value)}>
      <DropdownLabel css={{ width: '100%' }}>
        <GridLayout gridTemplateColumns="auto 1fr">
          <Box>
            {propValue}
            <Box as="span" fontSize="xs" ml="xs">
              ({themeSection[propValue]}
              {meta.unit})
            </Box>
          </Box>

          {meta.previewCss && (
            <Box
              justifySelf="end"
              bg="secondaryLight"
              border="regular"
              borderColor="secondaryDark"
              size="md"
              css={meta.previewCss(themeSection[propValue])}
            />
          )}
        </GridLayout>
      </DropdownLabel>

      <DropdownMenu>
        {keys(themeSection).map(key => (
          <DropdownMenuItem
            key={key}
            value={{ key: propKey, value: key }}
            pl="sm"
            pr="xxl"
            color={key === propValue ? 'primaryText' : 'secondaryText'}
            bg={key === propValue ? 'primary' : 'transparent'}
          >
            <GridLayout gridTemplateColumns="auto 1fr">
              <Box>
                {key}
                <Box as="span" fontSize="xs" ml="xs">
                  ({themeSection[key]}
                  {meta.unit})
                </Box>
              </Box>
              {meta.previewCss && (
                <Box
                  justifySelf="end"
                  bg="secondaryLight"
                  border="regular"
                  borderColor="secondaryDark"
                  size="md"
                  css={meta.previewCss(themeSection[key])}
                />
              )}
            </GridLayout>
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

class ComponentEditor extends React.Component<ComponentEditorProps> {
  render() {
    const { theme, themeProps, defaultThemeProps, onChange } = this.props;

    const mergedProps = mergeThemes(
      defaultThemeProps as any,
      (themeProps || {}) as any
    ) as ThemedComponentPropsWithVariants;

    return (
      <Box>
        {keys(mappings)
          .filter(mapping => mergedProps[mapping] !== undefined)
          .map((prop: keyof typeof mappings) => {
            const { themeProp } = mappings[prop] as ResponsivePropMapping;
            const propValue = mergedProps[prop];

            return (
              <GridLayout key={prop} gridTemplateColumns="120px 1fr" mb="md" alignItems="center">
                <Text p="none" ellipsis>
                  {prop}
                </Text>

                {typeof propValue === 'string' &&
                  (themeProp ? (
                    <ThemedPropEditor
                      propKey={prop}
                      propValue={propValue}
                      themeProp={themeProp}
                      themeSection={theme[themeProp]}
                      onChange={onChange}
                    />
                  ) : (
                    <Input border="none" fontWeight="bold" value={propValue as string} readOnly />
                  ))}

                {typeof propValue === 'object' && (
                  <GridLayout gridGap="sm" border="regular" borderColor="secondary" borderRadius="medium" p="sm">
                    {keys(propValue).map(breakpointKey => (
                      <Box>
                        <Text pb="xs">
                          {breakpointKey}
                          <Box as="span" ml="xs" fontSize="xs">
                            (min-width: {theme.breakpoints[breakpointKey]}
                            px)
                          </Box>
                        </Text>
                        {themeProp ? (
                          <ThemedPropEditor
                            propKey={prop}
                            propValue={propValue[breakpointKey]}
                            themeProp={themeProp}
                            themeSection={theme[themeProp]}
                            onChange={(key, value) => {
                              onChange(key, {
                                [breakpointKey]: value
                              });
                            }}
                          />
                        ) : (
                          <Input border="none" fontWeight="bold" value={propValue[breakpointKey]} readOnly />
                        )}
                      </Box>
                    ))}
                  </GridLayout>
                )}
              </GridLayout>
            );
          })}
      </Box>
    );
  }
}

type ComponentsEditorProps = {
  selectedComponents: ComponentWithDefaultTheme[];
  theme: Theme;
  onComponentThemeChange: (themeKey: string, variantKey?: string) => (key: string, value: string | object) => void;
};

export const ComponentsEditor: React.SFC<ComponentsEditorProps> = ({
  theme,
  selectedComponents,
  onComponentThemeChange
}) => (
  <React.Fragment>
    {selectedComponents.map(selectedComponent => {
      const themeKey = Object.keys(selectedComponent.defaultTheme)[0];

      return (
        <Box key={themeKey}>
          <H3 mb="md">{themeKey} theme</H3>

          <ComponentEditor
            defaultThemeProps={selectedComponent.defaultTheme[themeKey]}
            themeProps={theme.components[themeKey]}
            theme={theme}
            onChange={onComponentThemeChange(themeKey)}
          />

          {selectedComponent.defaultTheme[themeKey].variants && (
            <Box>
              {Object.keys((selectedComponent.defaultTheme[themeKey] as any).variants).map(variantKey => (
                <React.Fragment key={variantKey}>
                  <H3 fontSize="md" my="md">
                    variant: {variantKey}
                  </H3>
                  <ComponentEditor
                    defaultThemeProps={(selectedComponent.defaultTheme[themeKey] as any).variants[variantKey]}
                    themeProps={
                      theme.components[themeKey] &&
                      theme.components[themeKey].variants &&
                      theme.components[themeKey].variants![variantKey]
                    }
                    theme={theme}
                    onChange={onComponentThemeChange(themeKey, variantKey)}
                  />
                </React.Fragment>
              ))}
            </Box>
          )}
        </Box>
      );
    })}
  </React.Fragment>
);
