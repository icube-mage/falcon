import { Theme, CSSObject } from '@deity/falcon-ui';
import { fonts } from './fonts';

type ThemeMeta = {
  [name in keyof Theme]?: {
    unit?: string;
    input: {
      type: string;
      min?: number;
      step?: number;
      max?: number;
      options?: any[];
    };
    previewCss?: (value: string) => CSSObject;
  }
};

export const themeMeta: ThemeMeta = {
  colors: {
    input: {
      type: 'color'
    },

    previewCss: value => ({
      backgroundColor: value
    })
  },

  spacing: {
    input: {
      type: 'number',
      min: 0,
      step: 1,
      max: 100
    },
    unit: 'px',

    previewCss: value => ({
      width: value
    })
  },

  fonts: {
    input: {
      type: 'dropdown',
      options: fonts
    }
  },

  fontSizes: {
    input: {
      type: 'number',
      min: 0,
      step: 1,
      max: 80
    },

    previewCss: value => ({
      fontSize: value
    }),

    unit: 'px'
  },

  fontWeights: {
    input: {
      type: 'text'
    }
  },

  lineHeights: {
    input: {
      type: 'number',
      min: 0,
      step: 0.1,
      max: 3
    }
  },

  letterSpacings: {
    input: {
      type: 'text'
    },
    previewCss: value => ({
      letterSpacing: value
    })
  },

  breakpoints: {
    input: {
      type: 'number',
      step: 1,
      min: 0,
      max: 2048
    },

    unit: 'px'
  },

  borders: {
    input: {
      type: 'text'
    },
    previewCss: value => ({
      border: value
    })
  },

  borderRadius: {
    input: {
      type: 'number',
      min: 0,
      step: 1,
      max: 100
    },

    unit: 'px',
    previewCss: value => ({
      borderRadius: value
    })
  },

  boxShadows: {
    input: {
      type: 'text'
    },

    previewCss: value => ({
      boxShadow: value
    })
  },
  easingFunctions: {
    input: {
      type: 'text'
    }
  },

  transitionDurations: {
    input: {
      type: 'text'
    }
  }
};

export type ThemeCategories = {
  [name: string]: {
    name: string;
    themeSections: (keyof Theme)[];
  };
};
export const themeCategories: ThemeCategories = {
  colors: {
    name: 'Colors',
    themeSections: ['colors']
  },

  spacing: {
    name: 'Spacing',
    themeSections: ['spacing']
  },

  typography: {
    name: 'Typography',
    themeSections: ['fonts', 'fontSizes', 'fontWeights', 'letterSpacings', 'lineHeights']
  },

  breakpoints: {
    name: 'Breakpoints',
    themeSections: ['breakpoints']
  },

  borders: {
    name: 'Borders',
    themeSections: ['borders', 'borderRadius']
  },

  misc: {
    name: 'Miscellaneous',
    themeSections: ['boxShadows', 'easingFunctions', 'transitionDurations']
  }
};
