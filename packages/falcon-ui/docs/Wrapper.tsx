import React from 'react';
import { ThemeEditor, ThemeEditorState } from '@deity/falcon-theme-editor';
import Eye from 'react-feather/dist/icons/eye';
import { ThemeProvider, createTheme } from '../src';

const initialTheme = createTheme({
  fontWeights: {
    bold: 500
  },

  components: {},
  icons: {
    viewTheme: {
      icon: Eye
    },
    finder: {
      icon: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 24 24" {...props}>
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      ),
      size: 'xl',
      css: {
        cursor: 'pointer',
        fill: 'none'
      }
    }
  }
});

export default (props: any) => (
  <ThemeEditorState initial={initialTheme}>
    {({ theme, ...rest }) => (
      <React.Fragment>
        <ThemeProvider theme={theme} {...props} />
        <ThemeEditor theme={theme} {...rest} />
      </React.Fragment>
    )}
  </ThemeEditorState>
);
