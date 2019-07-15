import merge from 'deepmerge';
import isPlainObject from 'is-plain-object';
import { keyframes } from '@emotion/core';
import { mappings } from './responsiveprops';
import { Theme, RecursivePartial } from './index';

const themablePropsKeys = [...Object.keys(mappings), 'css'];

export function extractThemableProps(props: any) {
  const themableProps: any = {};
  const rest: any = {};

  // eslint-disable-next-line
  for (let key in props) {
    if (themablePropsKeys.indexOf(key as any) !== -1) {
      themableProps[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }

  return {
    themableProps,
    rest
  };
}

function isMergeableObject(object: any) {
  // emotion sets anim=1 to keyframes processed by keyframes function
  // such objects can't be merged but simply replaced
  return object.anim !== 1 && isPlainObject(object);
}

export function mergeThemes(theme: Theme, themeOverride: RecursivePartial<Theme>): Theme {
  const newTheme = merge(theme, themeOverride as Theme, {
    isMergeableObject
  });

  // keyframes merging needs to be handled in very special way
  // each not yet processed keyframes definitions needs to be passed
  // to emotion's keyframes function in order to be consumed in styles
  if (newTheme.keyframes) {
    // eslint-disable-next-line
    for (let keyframeKey in newTheme.keyframes) {
      // only process keyframes not yet processed by emotion (anim property not et)
      if (!newTheme.keyframes[keyframeKey].anim) {
        newTheme.keyframes[keyframeKey] = keyframes(newTheme.keyframes[keyframeKey]);
      }
    }
  }

  return newTheme;
}
