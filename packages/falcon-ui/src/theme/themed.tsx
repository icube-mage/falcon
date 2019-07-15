import React from 'react';
import styled from '@emotion/styled-base';
import isPropValid from '@emotion/is-prop-valid';

import {
  Theme,
  CSSObject,
  PropsWithTheme,
  ThemedComponentProps,
  ThemedComponentPropsWithVariants,
  InlineCss
} from './index';
import { extractThemableProps } from './utils';
import { defaultBaseTheme } from './theme';
import { mappings, PropsMappings, ResponsivePropMapping } from './responsiveprops';

const propsMappingKeys = Object.keys(mappings) as (keyof PropsMappings)[];

const convertPropToCss = (
  mappingKey: string,
  propMapping: ResponsivePropMapping,
  matchingProp: string | number,
  theme: Theme
): CSSObject => {
  // if mapping does not have cssProp specified fallback to it's key as css property name
  const cssPropName = propMapping.cssProp || mappingKey;
  // if matching props is themable prop then get it's actual value from theme props otherwise
  // then just pass it as css prop value
  // TODO: typescript: is there a way to improve those typings?
  const cssPropValue = !propMapping.themeProp ? matchingProp : (theme[propMapping.themeProp] as any)[matchingProp];

  if (propMapping.transformToCss) {
    return propMapping.transformToCss(cssPropValue);
  }

  return {
    [cssPropName]: cssPropValue
  };
};

type PropsWithVariant = {
  variant?: string;
};

type PropsWithDefaultTheme = {
  defaultTheme?: ThemedComponentPropsWithVariants | { [name: string]: ThemedComponentPropsWithVariants };
};

type ThemedProps = ThemedComponentProps & PropsWithTheme & PropsWithVariant & PropsWithDefaultTheme;

const convertThemedPropsToCss = (props: ThemedComponentProps, theme: Theme): CSSObject => {
  //  if theme is not provided via theme provider do not map anything
  if (!theme) {
    return {};
  }
  // TODO: typescript: can typings be improved for that object?
  const targetCss = {} as any;

  // eslint-disable-next-line
  for (let mappingKey in props) {
    const propMapping = mappings[mappingKey as keyof PropsMappings];
    const matchingProp = (props as any)[mappingKey];

    // move along if there is no matching prop in mappings for given key found
    if (!propMapping) {
      continue;
    }
    // if matching prop is typeof string it means it's not responsive
    if (typeof matchingProp === 'string' || typeof matchingProp === 'number') {
      const cssObject = convertPropToCss(mappingKey, propMapping, matchingProp, theme);
      // eslint-disable-next-line
      for (let mappingKey in cssObject) {
        targetCss[mappingKey] = cssObject[mappingKey];
      }
    } else {
      // if it's not string it needs to be object that has responsive breakpoints keys
      // here we only translate all themed values to css values, we don't create media queries
      // eslint-disable-next-line
      for (let breakpointKey in matchingProp) {
        const breakpointValue = (theme.breakpoints as any)[breakpointKey];
        const matchingResponsiveProp = matchingProp[breakpointKey];
        if (breakpointValue === undefined) {
          continue;
        }

        const cssObject = convertPropToCss(mappingKey, propMapping, matchingResponsiveProp, theme);
        // eslint-disable-next-line
        for (let mappingKey in cssObject) {
          if (!targetCss[mappingKey]) {
            targetCss[mappingKey] = {};
          }

          targetCss[mappingKey][breakpointKey] = cssObject[mappingKey];
        }
      }
    }
  }

  return targetCss;
};

const nestedCssObjectSelectors = [':', '&', '*', '>', '@'];

function convertResponsivePropsToMediaQueries(css: CSSObject, theme: Theme) {
  const target: any = {};
  const mediaQueries: any = {};

  // eslint-disable-next-line
  for (let cssProp in css) {
    const cssValue = css[cssProp];
    if (!cssValue || typeof cssValue !== 'object' || Array.isArray(cssValue)) {
      target[cssProp] = cssValue;
    }
    // we need to look for responsive props in nested css as well
    // for example in :hover object
    else if (nestedCssObjectSelectors.indexOf(cssProp[0]) !== -1) {
      target[cssProp] = convertResponsivePropsToMediaQueries(cssValue as CSSObject, theme);
    } else {
      // eslint-disable-next-line
      for (let potentialBreakpointKey in cssValue) {
        const breakpointValue = (theme.breakpoints as any)[potentialBreakpointKey];
        const valueForBreakpoint = (cssValue as any)[potentialBreakpointKey];

        if (breakpointValue) {
          // add media query key to mediaQueries object if it hasn't already got one
          if (!mediaQueries[potentialBreakpointKey]) {
            mediaQueries[potentialBreakpointKey] = {};
          }
          mediaQueries[potentialBreakpointKey][cssProp] = valueForBreakpoint;
        } else if (breakpointValue === 0) {
          target[cssProp] = valueForBreakpoint;
        } else {
          if (!target[cssProp]) {
            target[cssProp] = {};
          }

          target[cssProp][potentialBreakpointKey] = valueForBreakpoint;
        }
      }
    }
  }

  // media queries need to be handled in very careful way as order matters
  // so media min-width with smaller px value always apper before media min-width with larger px value
  // in resulting style
  Object.keys(mediaQueries)
    .sort((first, second) => ((theme.breakpoints as any)[first] > (theme.breakpoints as any)[second] ? 1 : -1))
    .forEach(sortedMediaQueryKey => {
      const mediaQueryPxValue = (theme.breakpoints as any)[sortedMediaQueryKey];
      target[`@media screen and (min-width: ${mediaQueryPxValue}px)`] = mediaQueries[sortedMediaQueryKey];
    });

  return target;
}

function getCss(css: InlineCss, props: ThemedProps) {
  return typeof css === 'function' ? css(props) : css;
}

// this function responsibility is to extract css object from
// both themed props (that use props values from theme) and css object/function props

// TODO: perhaps this function could be written in prettier way?
function getThemedCss(props: ThemedProps) {
  //  if theme is not provided via theme provider or inline theme prop
  // fall back to default theme
  if (!props.theme || !props.theme.components) {
    props = { ...props, theme: defaultBaseTheme };
  }

  const { defaultTheme, theme, variant, ...remainingProps } = props;
  let themeKey, defaultThemeProps;
  // defaultTheme specifies it's props in nested object which key is used as themeKey
  if (defaultTheme) {
    const potentialKey = Object.keys(defaultTheme)[0];

    themeKey = typeof (defaultTheme as any)[potentialKey] === 'object' ? potentialKey : undefined;
    defaultThemeProps = themeKey ? (defaultTheme as any)[themeKey] : undefined;
  }

  // first we need to check where themed props and css props are defined and merge them
  // // css props need to merged separately as those do not need to be processed to extract css
  // Merging order
  // 1 -  props defined in defaultTheme props  as those are defaults
  // 2 -  props defined in theme.components for given themeKey  as those are defaults
  // 3 -  props defined in defaultTheme variant prop if props.variant is defined
  // 4 -  props defined in theme.components[]variants if props.variant is defined
  // 5 -  props defined directly on component
  const themedPropsToMerge: any[] = [];
  const cssPropsToMerge: any[] = [];

  const addPropsToMerge = (propsToMerge: ThemedComponentProps) => {
    const { css, ...rest } = propsToMerge;
    if (css) {
      cssPropsToMerge.push(getCss(css, props));
    }
    themedPropsToMerge.push(rest);
  };

  //  start with props defined in defaultTheme prop as base
  if (defaultThemeProps !== undefined) {
    addPropsToMerge(defaultThemeProps);
  }

  // if props are defined in theme object for themeKey merge them with default ones
  if (themeKey) {
    const areComponentPropsDefinedInTheme = themeKey && theme.components[themeKey] !== undefined;
    if (areComponentPropsDefinedInTheme) {
      addPropsToMerge(theme.components[themeKey]);
    }

    // themed props can also be defined for component variant
    if (variant) {
      // check for variant props defined in defaultTheme
      const defaultThemeVariants = defaultThemeProps && defaultThemeProps.variants;

      if (defaultThemeVariants && defaultThemeVariants[variant]) {
        addPropsToMerge(defaultThemeVariants[variant]);
      }
      // check for variant props defined in theme object
      const themeVariants = areComponentPropsDefinedInTheme && theme.components[themeKey].variants;
      if (themeVariants && themeVariants[variant]) {
        addPropsToMerge(themeVariants[variant]);
      }
    }
  }
  const { css: inlineCss, ...remainingThemedProps } = remainingProps;
  // out of all component props extract themable ones, convert to css
  // and add to merge
  const { themableProps } = extractThemableProps(remainingThemedProps);
  cssPropsToMerge.push(convertThemedPropsToCss(themableProps, theme));

  // as last step add for merging those props which defined directly on component
  if (inlineCss) {
    cssPropsToMerge.push(getCss(inlineCss, props));
  }

  const cssProps = Object.assign({}, ...cssPropsToMerge);
  const mergedThemableProps = Object.assign({}, ...themedPropsToMerge);
  // merged themable props need to be converted to css before returning
  const cssFromThemedProps = convertThemedPropsToCss(mergedThemableProps, theme);

  // finally merge css from themed props with css from css props
  const mergedCss = { ...cssFromThemedProps, ...cssProps };
  // as a last step we need to check each css prop if it's value is responsive
  return convertResponsivePropsToMediaQueries(mergedCss, theme);
}

// filtering which props to forward to next component is tricky
// and behaves differently if next component is html element, custom component
// or custom component whihch is themed component
const customPropsBlacklist = ['as', 'tag', 'variant', 'defaultTheme', 'css'];

const filterPropsToForward = (baseComponent: any, props: any, ref: any) => {
  const filteredProps: any = {};
  const isHtmlTag = typeof baseComponent === 'string';
  // eslint-disable-next-line
  for (let key in props) {
    // when html tag is provided forward only valid html props to it
    if (isHtmlTag && !isPropValid(key)) continue;

    // if custom component is provided via `as` prop do not forward themable props to it (bg, color, m, p etc)
    // neighter forward any of the blacklisted props
    const themableProp = propsMappingKeys.indexOf(key as any) !== -1 || customPropsBlacklist.indexOf(key) !== -1;
    if (themableProp) continue;

    filteredProps[key] = props[key];
  }

  filteredProps.ref = ref;

  return filteredProps;
};

// this component handles dynamic html tag rendering via and 'as' prop as well as forwards ref to DOM element
// and forwards only allowed html tags
const Tag = React.forwardRef<{}, { tag: any; as: any }>((props, ref) => {
  const Base = props.as || props.tag || 'div';
  const nextProps = filterPropsToForward(Base, props as any, ref);

  return React.createElement(Base, nextProps);
});

export type BaseProps<TTag extends string | {}> = {
  as?: TTag;
} & PropsWithVariant &
  (TTag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[TTag] : {}) &
  (TTag extends React.ComponentType<infer TExtendProps> ? Partial<TExtendProps> : {});

type DefaultProps<TTag extends string | {}> = (TTag extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TTag]
  : {}) &
  (TTag extends React.ComponentType<infer TExtendProps> ? Partial<TExtendProps> : {});

type ThemedOptions<TTag extends string | {}, TProps> = {
  tag?: TTag;

  defaultTheme?: { [name: string]: ThemedComponentPropsWithVariants<TProps> };

  defaultProps?: DefaultProps<TTag> & TProps;
};

export type DefaultThemeProps = { [name: string]: ThemedComponentPropsWithVariants };

export function themed<TProps, TTag extends string | {}>(options: ThemedOptions<TTag, TProps>) {
  let label = '';

  if (options.defaultTheme) {
    const componentKey = Object.keys(options.defaultTheme)[0];
    if (typeof (options.defaultTheme as any)[componentKey] === 'object') {
      label = `${componentKey}`;
    }
  }

  const styledComponentWithThemeProps = styled(Tag, {
    label, // label is transformed for displayName of styled component,
    // target inserted as css class in resulting element so this could potentially be used as a fallback
    // to style components via traditional css
    target: `themed${
      label
        ? `-${label
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase()}`
        : ''
    }`
  })(getThemedCss);

  // default theme is also passed as part of default props
  styledComponentWithThemeProps.defaultProps = {
    ...(options.defaultProps as any),
    defaultTheme: options.defaultTheme,
    tag: options.tag
  };

  return styledComponentWithThemeProps as <TTagOverride extends string | {} = TTag>(
    props: BaseProps<TTagOverride> &
      Partial<typeof options['defaultProps']> &
      ThemedComponentProps &
      PropsWithVariant & {
        defaultTheme?: DefaultThemeProps;
      }
  ) => JSX.Element;
}
