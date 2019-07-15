import React from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { ThemeStateContext } from '@deity/falcon-theme-editor';
import { Icon, Button, FlexLayout, H2 } from '../src';

const ThemePreview: React.SFC<any> = props => {
  const themeKey = Array.isArray(props.of)
    ? Object.keys(props.of[0].defaultProps.defaultTheme)
    : Object.keys(props.of.defaultProps.defaultTheme);

  return (
    <ThemeStateContext.Consumer>
      {({ selectComponents }) => (
        <FlexLayout my="lg" alignItems="center">
          <H2 css={{ textTransform: 'capitalize' }} mr="md">
            {props.name || themeKey}
          </H2>
          <Button
            onClick={() => {
              if (Array.isArray(props.of)) {
                selectComponents(props.of.map(component => component.defaultProps));
              } else {
                selectComponents([props.of.defaultProps]);
              }
            }}
          >
            <Icon stroke="white" size="md" src="viewTheme" mr="xs" /> view theme
          </Button>
        </FlexLayout>
      )}
    </ThemeStateContext.Consumer>
  );
};

export default withMDXComponents(ThemePreview);
