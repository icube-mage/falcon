import React from 'react';
import { ThemeProvider, Box, Divider, FlexLayout, Icon, Sidebar, Portal } from '@deity/falcon-ui';

import { ComponentsEditor } from './ComponentsEditor';
import { ComponentFinder } from './ComponentFinder';
import { Tabs } from './Tabs';
import { ThemeEditorStateRenderProp } from './ThemeEditorState';
import { ThemePropsEditor } from './ThemePropsEditor';
import { editorTheme } from './editortheme';
import { ThemeDownloader } from './ThemeDownloader';
import { ThemePresets, Preset } from './ThemePresets';
import { fonts } from './fonts';

export * from './ThemeEditorState';
export * from './thememeta';

type ThemeEditorProps = ThemeEditorStateRenderProp & { side?: 'left' | 'right' };

export class ThemeEditor extends React.Component<ThemeEditorProps> {
  onChange = (themeKey: string, propName: string, isNumber?: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.updateTheme({
      [themeKey]: {
        [propName]: isNumber ? +e.target.value : e.target.value
      }
    });
  };

  onFontChange = (fontKind: string) => (fontOption: any) => {
    this.props.updateTheme({
      fonts: {
        [fontKind]: fontOption.value
      } as any
    });

    if (fontOption.google) {
      this.loadGoogleFont(fontOption.google);
    }
  };

  onPresetChange = (preset: Preset) => () => {
    requestAnimationFrame(() => {
      this.props.updateTheme(preset.theme, { useInitial: true });
    });

    this.props.setActivePreset(preset.name);

    if (!preset.theme.fonts) {
      return;
    }
    const newFont = preset.theme.fonts.sans;

    const potentiallFontToLoad = fonts.filter(font => font.value === newFont)[0];

    if (potentiallFontToLoad && potentiallFontToLoad.google) {
      this.loadGoogleFont(potentiallFontToLoad.google);
    }
  };

  onComponentThemeChange = (themeKey: string, variantKey?: string) => (key: string, value: string | object) => {
    if (variantKey) {
      this.props.updateTheme({
        components: {
          [themeKey]: {
            variants: {
              [variantKey]: {
                [key]: value
              }
            }
          }
        }
      });
    } else {
      this.props.updateTheme({
        components: {
          [themeKey]: {
            [key]: value
          }
        }
      });
    }
  };

  loadGoogleFont(font: string) {
    // require is inline as webfontloader does not work server side
    // https://github.com/typekit/webfontloader/issues/383
    const WebFontLoader = require('webfontloader');

    WebFontLoader.load({
      google: {
        families: [font]
      }
    });
  }

  render() {
    const {
      visible,
      toggleVisibility,
      toggleFinder,
      setActiveTab,
      activeTab,
      finderActive,
      theme,
      tabs,
      toggleOpenPanel,
      initialTheme
    } = this.props;

    const side = this.props.side || 'right';

    return (
      <ThemeProvider theme={editorTheme} withoutRoot>
        <Sidebar
          as={Portal}
          visible={visible}
          side={side}
          css={{ position: 'fixed', overflowX: 'inherit' }}
          boxShadow="subtle"
          bg="white"
        >
          <FlexLayout
            flexDirection="column"
            py="sm"
            pl="sm"
            css={{
              width: {
                xs: '75vw',
                sm: 480
              }
            }}
          >
            <Tabs onChange={setActiveTab} active={activeTab} />

            <Divider my="sm" />

            <Box
              flex="1"
              css={props => ({
                overflowY: 'overlay' as any,
                paddingRight: 10,
                marginRight: 6,
                '::-webkit-scrollbar': {
                  width: 3,
                  backgroundColor: props.theme.colors.secondaryLight,
                  borderRadius: props.theme.borderRadius.medium
                },

                '::-webkit-scrollbar-thumb': {
                  borderRadius: props.theme.borderRadius.medium,
                  backgroundColor: props.theme.colors.secondaryDark
                }
              })}
            >
              {activeTab === 'theme' && (
                <ThemePropsEditor
                  openPanels={tabs.theme.openPanels}
                  toggleOpenPanel={toggleOpenPanel}
                  onChange={this.onChange}
                  onFontChange={this.onFontChange}
                  theme={theme}
                />
              )}

              {activeTab === 'component' && tabs.component.selectedComponents.length > 0 && (
                <ComponentsEditor
                  selectedComponents={tabs.component.selectedComponents}
                  onComponentThemeChange={this.onComponentThemeChange}
                  theme={theme}
                />
              )}

              {activeTab === 'component' && tabs.component.selectedComponents.length === 0 && (
                <Box fontSize="md">
                  There are no components selected currenty, <br />
                  use component finder
                  <Icon onClick={toggleFinder} mx="sm" stroke={finderActive ? 'primary' : 'black'} src="finder" />
                  to select one.
                </Box>
              )}

              {activeTab === 'download' && <ThemeDownloader currentTheme={theme} initialTheme={initialTheme} />}

              {activeTab === 'presets' && (
                <ThemePresets activePreset={tabs.presets.active} onPresetChange={this.onPresetChange} />
              )}
            </Box>
          </FlexLayout>

          <Box
            position="absolute"
            {...{ [side]: '100%' }}
            top="calc(50% - 35px)"
            display="flex"
            bg="white"
            alignItems="center"
            justifyContent="center"
            boxShadow="subtle"
            flexDirection="column"
            p="sm"
            css={
              side === 'right'
                ? {
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    boxShadow: '-2px 5px 5px rgba(0,0,0,.1)'
                  }
                : {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    boxShadow: '2px 5px 5px rgba(0,0,0,.1)'
                  }
            }
          >
            <Box
              title={`${visible ? 'Close' : 'Open'} theme editor`}
              css={{ cursor: 'pointer' }}
              onClick={toggleVisibility}
            >
              <Icon src="theme" fill={visible ? 'primary' : 'black'} stroke={visible ? 'primary' : 'black'} />
            </Box>
            <Divider m="xs" css={{ width: '100%' }} />
            <Box title="Select a themable component in the page to inspect its theme" onClick={toggleFinder}>
              <Icon stroke={finderActive ? 'primary' : 'black'} src="finder" />
            </Box>
          </Box>
        </Sidebar>
        {finderActive && <ComponentFinder onChange={this.props.selectComponents} />}
      </ThemeProvider>
    );
  }
}
