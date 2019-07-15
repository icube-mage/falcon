import React from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { ThemeStateContext } from '@deity/falcon-theme-editor';
import { Icon, Button } from '../src';

const ViewThemeSection: React.SFC<{ section: string }> = ({ section, children }) => (
  <ThemeStateContext.Consumer>
    {({ openThemePropsPanel }) => (
      <Button
        mr="xs"
        onClick={() => {
          openThemePropsPanel(section);
        }}
      >
        <Icon stroke="white" size="md" src="viewTheme" mr="xs" /> {children}
      </Button>
    )}
  </ThemeStateContext.Consumer>
);

export default withMDXComponents(ViewThemeSection);
