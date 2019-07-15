import React from 'react';
import {
  Details,
  Summary,
  DetailsContent,
  GridLayout,
  Theme,
  NumberInput,
  RangeInput,
  Text,
  Dropdown,
  DropdownLabel,
  DropdownMenu,
  DropdownMenuItem,
  Input
} from '@deity/falcon-ui';

import { themeCategories, themeMeta } from './thememeta';
import { fonts } from './fonts';

type ThemePropsEditorProps = {
  openPanels: {
    [name: string]: boolean;
  };
  theme: Theme;
  toggleOpenPanel: (panelKey: string) => void;
  onChange: (
    themeKey: string,
    propName: string,
    isNumber?: boolean
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFontChange: (fontKind: string) => (fontOption: any) => void;
};

type EditorSectionProps = {
  section: keyof Theme;
  theme: Theme;
  onChange: (
    themeKey: string,
    propName: string,
    isNumber?: boolean
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFontChange: (fontKind: string) => (fontOption: any) => void;
};

const EditorSection: React.SFC<EditorSectionProps> = ({ theme, section, onChange, onFontChange }) => (
  <React.Fragment>
    {Object.keys(theme[section]).map(themeProp => {
      const meta = themeMeta[section];
      if (!meta) return null;

      return (
        <GridLayout
          alignItems="center"
          gridGap="xs"
          mb="xs"
          gridTemplateColumns={meta.input.type === 'dropdown' ? '50px auto 1.8fr 20px' : '1.1fr auto 1.8fr 35px'}
          key={themeProp}
        >
          <Text p="xs">{`"${themeProp}"`}</Text>

          {meta.input.type === 'number' && (
            <React.Fragment>
              <NumberInput
                value={(theme as any)[section][themeProp]}
                min={meta.input.min}
                max={meta.input.max}
                step={meta.input.step}
                onChange={onChange(section, themeProp, true)}
              />

              <RangeInput
                value={(theme as any)[section][themeProp]}
                min={meta.input.min}
                max={meta.input.max}
                step={meta.input.step}
                onChange={onChange(section, themeProp, true)}
              />
              <Text p="none" ml="xs" fontSize="sm">
                px
              </Text>
            </React.Fragment>
          )}
          {meta.input.type === 'dropdown' && (
            <Dropdown onChange={onFontChange(themeProp)} gridColumn="span 3">
              <DropdownLabel>{(theme as any)[section][themeProp]}</DropdownLabel>
              <DropdownMenu>
                {fonts.map(font => (
                  <DropdownMenuItem key={font.value} value={font}>
                    {`${font.value} ${font.google ? ' - (Google Font)' : ''}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {meta.input.type === 'color' && (
            <Input
              onChange={onChange(section, themeProp)}
              type="color"
              gridColumn="span 2"
              value={(theme as any)[section][themeProp]}
              css={{
                padding: 0,
                width: 60,
                borderRadius: 0,
                border: 'none'
              }}
            />
          )}

          {meta.input.type === 'text' && (
            <Input
              onChange={onChange(section, themeProp)}
              gridColumn="span 3"
              type="text"
              value={(theme as any)[section][themeProp]}
            />
          )}
        </GridLayout>
      );
    })}
  </React.Fragment>
);

export const ThemePropsEditor: React.SFC<ThemePropsEditorProps> = ({
  openPanels,
  toggleOpenPanel,
  theme,
  onChange,
  onFontChange
}) => (
  <GridLayout gridGap="xs">
    {Object.keys(themeCategories).map(categoryKey => {
      const category = themeCategories[categoryKey];
      return (
        <Details key={category.name} open={openPanels[categoryKey]}>
          <Summary
            onClick={e => {
              e.preventDefault();
              toggleOpenPanel(categoryKey);
            }}
          >
            {category.name}
          </Summary>

          {openPanels[categoryKey] && (
            <DetailsContent pr="xs">
              {category.themeSections.length === 1 && (
                <EditorSection
                  section={category.themeSections[0]}
                  theme={theme}
                  onChange={onChange}
                  onFontChange={onFontChange}
                />
              )}

              {category.themeSections.length > 1 &&
                category.themeSections.map(section => {
                  const key = categoryKey + section;

                  return (
                    <Details mb="sm" key={key} open={openPanels[key]}>
                      <Summary
                        onClick={e => {
                          e.preventDefault();
                          toggleOpenPanel(key);
                        }}
                      >
                        {section}
                      </Summary>
                      <DetailsContent mr="xs">
                        <EditorSection
                          section={section}
                          theme={theme}
                          onChange={onChange}
                          onFontChange={onFontChange}
                        />
                      </DetailsContent>
                    </Details>
                  );
                })}
            </DetailsContent>
          )}
        </Details>
      );
    })}
  </GridLayout>
);
