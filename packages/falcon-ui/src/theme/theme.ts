export const defaultBaseTheme = {
  colors: {
    primary: '#A9CF38',
    primaryLight: '#CBDE6E',
    primaryDark: '#95B82C',
    primaryText: '#FFFFFF',

    secondary: '#EEF0F2',
    secondaryLight: '#F8F8F8',
    secondaryDark: '#E8E8E8',
    secondaryText: '#5F6367',

    error: '#E74C3C',
    errorText: '#000000',

    black: '#5f6367',
    white: '#FFFFFF',
    transparent: 'transparent'
  },

  breakpoints: {
    xs: 0,
    sm: 640,
    md: 860,
    lg: 1280,
    xl: 1920
  },

  spacing: {
    none: 0,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
    xxxl: 64
  },

  fonts: {
    sans: '"Segoe UI", system-ui, sans-serif',
    mono: '"SF Mono", monospace'
  },

  fontSizes: {
    xxs: 12,
    xs: 14,
    sm: 16,
    md: 20,
    lg: 26,
    xl: 39,
    xxl: 48,
    xxxl: 96
  },

  fontWeights: {
    light: 300,
    regular: 400,
    bold: 700
  },

  lineHeights: {
    small: 1,
    default: 1.5,
    large: 2
  },

  letterSpacings: {
    normal: 'normal',
    caps: '0.025em'
  },

  borders: {
    none: 'none',
    regular: '1px solid',
    bold: '2px solid'
  },

  borderRadius: {
    none: 0,
    small: 2,
    medium: 4,
    large: 8,
    round: 333
  },

  boxShadows: {
    none: 'none',
    subtle: '0 5px 5px rgba(0,0,0,.1)',
    pronounced: '0 0 2px 0 rgba(0,0,0,.08),0 2px 8px 0 rgba(0,0,0,.16)',
    strong: '0 0 2px 0 rgba(0,0,0,.08),0 4px 16px 0 rgba(0,0,0,.16)',
    distant: '0 0 2px 0 rgba(0,0,0,.08),0 8px 32px 0 rgba(0,0,0,.16)'
  },

  easingFunctions: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  },

  transitionDurations: {
    short: '150ms',
    standard: '250ms',
    long: '375ms'
  },

  keyframes: {},

  zIndex: {
    dropDownMenu: 600,
    backdrop: 800,
    sidebar: 1000
  },

  components: {},

  icons: {}
};
