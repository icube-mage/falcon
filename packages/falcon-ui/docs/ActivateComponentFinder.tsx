import React from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { ThemeStateContext } from '@deity/falcon-theme-editor';
import { Icon, Text } from '../src';

const ActivateComponentFinder: React.SFC = () => (
  <ThemeStateContext.Consumer>
    {({ toggleFinder, finderActive }) => (
      <Text>
        The easiest way to find component key to use in <b>components</b> object in theme object is to use Theme
        Editor&apos;s
        <b> Component Locator</b>
        <Icon onClick={toggleFinder} ml="xs" src="finder" stroke={finderActive ? 'primary' : 'black'} />. Just click on
        the icon on the right to activate it and hover over interesting component to display it&apos;s key to use in{' '}
        <b>components</b> object (for example <b>Card</b> component below).
      </Text>
    )}
  </ThemeStateContext.Consumer>
);

export default withMDXComponents(ActivateComponentFinder);
