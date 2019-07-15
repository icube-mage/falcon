import React from 'react';
import { Box, Portal } from '@deity/falcon-ui';
import { ComponentWithDefaultTheme } from './ThemeEditorState';

function throttle(callback: Function, wait: number, context: Object) {
  let timeout: number | undefined;
  let callbackArgs: any[];

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = undefined;
  };

  return (...args: any[]) => {
    if (!timeout) {
      callbackArgs = args;
      timeout = window.setTimeout(later, wait);
    }
  };
}

type ComponentFinderState = {
  locatedComponent?: {
    rect: ClientRect;
    defaultTheme: ComponentWithDefaultTheme;
  };
};

type ComponentFinderProps = {
  onChange: (components: ComponentWithDefaultTheme[]) => void;
};

function getNearestThemableComponentForElement(el: Element) {
  const maxElementHierarchyTraversal = 3;
  let currentTraversal = 0;
  let elementToCheck: Element | null = el;

  while (currentTraversal < maxElementHierarchyTraversal) {
    if (!elementToCheck) return;
    // __reactInternalInstance trick based on https://stackoverflow.com/a/50204915/105206
    // eslint-disable-next-line
    for (const key in elementToCheck) {
      if (key.startsWith('__reactInternalInstance$')) {
        const fiberNode = (elementToCheck as any)[key];
        // eslint-disable-next-line
        const component = fiberNode && fiberNode._debugOwner;
        const defaultTheme = component && component.memoizedProps && component.memoizedProps.defaultTheme;

        if (defaultTheme) {
          return {
            defaultTheme: defaultTheme as ComponentWithDefaultTheme,
            rect: elementToCheck.getBoundingClientRect() as ClientRect
          };
        }

        // some themed components render via another component, like checkbox
        // so we need to search for parent's defaultTheme prop as well
        // eslint-disable-next-line
        const parentComponent = component && component._debugOwner;
        const parentDefaultTheme =
          parentComponent && parentComponent.memoizedProps && parentComponent.memoizedProps.defaultTheme;
        if (parentDefaultTheme && elementToCheck.parentElement) {
          return {
            defaultTheme: parentDefaultTheme as ComponentWithDefaultTheme,
            rect: elementToCheck.parentElement.getBoundingClientRect() as ClientRect
          };
        }
      }
    }

    elementToCheck = elementToCheck.parentElement;
    currentTraversal++;
  }

  return undefined;
}

// based on https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
function getHashCode(val: string) {
  let hash = 0;
  if (val.length === 0) return hash;
  for (let i = 0; i < val.length; i++) {
    // eslint-disable-next-line
    hash = val.charCodeAt(i) + ((hash << 5) - hash);
    // eslint-disable-next-line
    hash &= hash;
  }
  return hash;
}

function getHSLA(hash: number) {
  const shortened = hash % 360;
  return `hsla(${shortened}, 90%, 30%, 0.2)`;
}

export class ComponentFinder extends React.Component<ComponentFinderProps, ComponentFinderState> {
  readonly state: ComponentFinderState = {};

  componentDidMount() {
    this.throttledOnChange = throttle(this.onChange, 50, this);
    window.addEventListener('mousemove', this.throttledOnChange as any);
    window.addEventListener('click', this.onClick, true);
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.throttledOnChange as any);
    window.removeEventListener('click', this.onClick, true);
    window.addEventListener('scroll', this.onScroll);
    this.currentElementFromPoint = undefined;
    this.throttledOnChange = undefined;
  }

  onChange(e: MouseEvent) {
    const elementFromPoint = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementFromPoint) return;
    if (this.currentElementFromPoint === elementFromPoint) return;

    this.currentElementFromPoint = elementFromPoint;

    const nearestThemableComponent = getNearestThemableComponentForElement(this.currentElementFromPoint);

    requestAnimationFrame(() => {
      this.setState({
        locatedComponent: nearestThemableComponent
      });
    });
  }

  onClick = (e: MouseEvent) => {
    if (!this.props.onChange) return;
    if (!this.state.locatedComponent) return;

    this.props.onChange([
      {
        defaultTheme: this.state.locatedComponent.defaultTheme
      }
    ]);

    e.preventDefault();
    e.stopPropagation();
  };

  onScroll = () => {
    if (!this.state.locatedComponent) return;
    this.setState({
      locatedComponent: undefined
    });
  };

  currentElementFromPoint?: Element = undefined;
  throttledOnChange?: Function = undefined;

  renderOverlay() {
    const { locatedComponent } = this.state;
    if (!locatedComponent) return null;

    const themeKey = Object.keys(locatedComponent.defaultTheme)[0];

    return (
      <Box
        position="absolute"
        style={{
          left: locatedComponent.rect.left,
          right: locatedComponent.rect.right,
          top: locatedComponent.rect.top,
          bottom: locatedComponent.rect.bottom,
          height: locatedComponent.rect.height,
          width: locatedComponent.rect.width,
          backgroundColor: getHSLA(getHashCode(themeKey))
        }}
      >
        <Box bg="black" position="absolute" bottom="100%" fontSize="sm" px="sm" py="xs" color="white">
          {themeKey}
        </Box>
      </Box>
    );
  }

  render() {
    return (
      <Portal>
        <Box position="fixed" top="0" left="0" css={{ pointerEvents: 'none', height: 100, width: 100, zIndex: 10000 }}>
          {this.renderOverlay()}
        </Box>
      </Portal>
    );
  }
}
