import React from 'react';
import { RecursivePartial, Theme, Group, Button } from '@deity/falcon-ui';

export type Preset = {
  name: string;
  theme: RecursivePartial<Theme>;
};

export const availablePresets: Preset[] = [
  {
    name: 'Deity Green',
    theme: {
      colors: {
        primary: '#A9CF38',
        primaryLight: '#CBDE6E',
        primaryDark: '#A9CF38',
        primaryText: '#fff'
      },
      components: {
        navbar: {
          bgFullWidth: 'primary'
        },

        navbarItem: {
          color: 'primaryText'
        }
      }
    }
  },

  {
    name: 'Ocean Blue',
    theme: {
      colors: {
        primary: '#2196f3',
        primaryLight: '#6ec6ff',
        primaryDark: '#0069c0',
        primaryText: '#ffffff',

        secondary: '#eef0f2',
        secondaryLight: '#f8f8f8',
        secondaryDark: '#e8e8e8',
        secondaryText: '#5f6367',

        error: '#f44336',
        errorText: '#000000'
      },
      spacing: {
        none: 0,
        xs: 12,
        sm: 20,
        md: 28,
        lg: 36,
        xl: 44,
        xxl: 52,
        xxxl: 70
      },
      fonts: {
        sans: 'Bubblegum Sans'
      },
      fontSizes: {
        xs: 13,
        sm: 18,
        md: 22,
        lg: 28,
        xl: 45,
        xxl: 56,
        xxxl: 120
      },
      borderRadius: {
        medium: 333
      },

      components: {
        searchbarLayout: {
          gridTemplate: '"logo cart signIn login" / 1fr auto auto auto',
          alignItems: 'center',
          css: {
            justifyItems: 'center'
          }
        },
        productListLayout: {
          gridTemplateColumns: 'repeat(auto-fill,minmax(420px,1fr))',
          gridAutoRows: '340px',
          gridGap: 'md'
        },

        navbar: {
          bgFullWidth: 'transparent',
          bg: 'primary',
          borderRadius: 'round',
          mt: 'xs',
          justifyContent: 'center'
        },

        navbarItem: {
          color: 'primaryText'
        },

        productDetailsLayout: {
          p: 'sm',
          gridTemplateColumns: {
            md: '1fr 1fr'
          },
          gridTemplateAreas: {
            md:
              '"sku gallery" "title gallery" "price gallery" "options gallery" "cta gallery" "description gallery" "meta gallery"'
          }
        }
      }
    }
  },
  {
    name: 'Insanely Pink',
    theme: {
      colors: {
        primary: '#e45e93',
        primaryLight: '#ed92b6',
        primaryDark: '#c52163',
        primaryText: '#fff',

        errorText: '#000000',
        black: '#9b9aa0'
      },

      fonts: {
        sans: 'Bangers'
      },

      components: {
        searchbarLayout: {
          gridTemplate: '"cart logo signIn login" / auto 1fr auto auto',
          alignItems: 'center',
          my: 'sm',
          css: {
            justifyItems: 'center'
          }
        },

        icon: {
          stroke: 'secondaryDark'
        },

        productListLayout: {
          css: {
            '& img': {
              transform: 'skew(15deg)'
            }
          }
        },
        navbar: {
          bgFullWidth: 'transparent',
          borderColor: 'primary',
          justifyContent: 'center',

          css: {
            transform: 'skew(15deg)',
            borderBottomStyle: 'solid',
            borderBottomWidth: 2
          }
        },
        navbarItem: {
          fontSize: 'xl',
          css: (props: any) => ({
            color: props.theme.colors.black
          })
        }
      }
    }
  }
];

type ThemePresetsProps = {
  onPresetChange: (preset: Preset) => () => void;
  activePreset: string;
};
export const ThemePresets: React.SFC<ThemePresetsProps> = ({ activePreset, onPresetChange }) => (
  <Group my="md" mx="md" display="flex">
    {availablePresets.map(preset => (
      <Button
        key={preset.name}
        variant={preset.name === activePreset ? '' : 'secondary'}
        flex="1"
        height="xxl"
        onClick={onPresetChange(preset)}
      >
        {preset.name}
      </Button>
    ))}
  </Group>
);
