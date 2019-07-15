import { Theme, mergeThemes, ThemedComponents, RecursivePartial } from '@deity/falcon-ui';
import React from 'react';
import { TabKeys } from './Tabs';

export type ComponentWithDefaultTheme = {
  defaultTheme: ThemedComponents;
};

export type ThemeStateContextType = {
  selectComponents?: (components: ComponentWithDefaultTheme[]) => void;
  openThemePropsPanel?: (panel: string, subpanel?: string) => void;
  toggleFinder?: () => void;
  openEditor?: boolean;
  finderActive?: boolean;
};

export const ThemeStateContext = React.createContext<ThemeStateContextType>({});

type ThemeEditorStateState = {
  activeTheme: Theme;
  visible: boolean;
  finderActive: boolean;
  activeTab: TabKeys;
  tabs: {
    theme: {
      openPanels: {
        [name: string]: boolean;
      };
    };
    component: {
      selectedComponents: ComponentWithDefaultTheme[];
    };
    presets: {
      active: string;
    };
  };
};

export type ThemeEditorStateRenderProp = {
  theme: Theme;
  initialTheme: Theme;
  updateTheme: (themeDiff: RecursivePartial<Theme>, options?: any) => void;
  selectComponents: (components: ComponentWithDefaultTheme[]) => void;
  openEditor?: boolean;
  toggleVisibility: () => void;
  toggleFinder: () => void;
  visible: boolean;
  finderActive: boolean;
  activeTab: TabKeys;
  setActiveTab: (tabKey: TabKeys) => void;
  setActivePreset: (presetKey: string) => void;
  toggleOpenPanel: (panelKey: string) => void;
  tabs: {
    theme: {
      openPanels: {
        [name: string]: boolean;
      };
    };
    component: {
      selectedComponents: ComponentWithDefaultTheme[];
    };
    presets: {
      active: string;
    };
  };
};

type ThemeEditorStateProps = {
  initial: Theme;
  children: (renderProp: ThemeEditorStateRenderProp) => React.ReactNode;
};

export class ThemeEditorState extends React.Component<ThemeEditorStateProps, ThemeEditorStateState> {
  constructor(props: ThemeEditorStateProps) {
    super(props);

    this.state = {
      activeTheme: props.initial,
      visible: false,
      finderActive: false,
      activeTab: 'theme',

      tabs: {
        theme: {
          openPanels: {}
        },
        component: {
          selectedComponents: []
        },
        presets: {
          active: 'Deity Green'
        }
      }
    };
  }

  setActiveTab = (tabKey: TabKeys) => {
    this.setState({
      activeTab: tabKey
    });
  };

  setActivePreset = (presetKey: string) => {
    this.setState(state => {
      const tabs = { ...state.tabs };
      const presets = { ...{ ...tabs.presets } };
      presets.active = presetKey;
      tabs.presets = presets;

      return {
        tabs
      };
    });
  };

  updateTheme = (themeDiff: RecursivePartial<Theme>, { useInitial = false }: { useInitial?: boolean } = {}) => {
    requestAnimationFrame(() => {
      this.setState(state => {
        const themeBase = useInitial ? this.props.initial : state.activeTheme;

        return {
          activeTheme: mergeThemes(themeBase, themeDiff)
        };
      });
    });
  };

  toggleFinder = () => {
    this.setState(state => ({ finderActive: !state.finderActive }));
  };

  toggleVisibility = () => {
    this.setState(state => ({ visible: !state.visible }));
  };

  selectComponents = (components: ComponentWithDefaultTheme[]) => {
    requestAnimationFrame(() => {
      this.setState(state => {
        const tabs = { ...state.tabs };
        tabs.component = {
          selectedComponents: components
        };

        return {
          tabs,
          activeTab: 'component',
          visible: true,
          finderActive: false
        };
      });
    });
  };

  toggleOpenPanel = (key: string) => {
    this.setState(state => {
      const tabs = { ...state.tabs };
      const openPanels = { ...{ ...tabs.theme }.openPanels };

      openPanels[key] = !openPanels[key];

      tabs.theme.openPanels = openPanels;
      return {
        tabs
      };
    });
  };

  openThemePropsPanel = (panel: string, subpanel?: string) => {
    this.setState(state => {
      const tabs = { ...state.tabs };
      const openPanels = {
        [panel]: true
      };

      if (subpanel) {
        openPanels[panel + subpanel] = true;
      }

      tabs.theme.openPanels = openPanels;
      return {
        tabs,
        activeTab: 'theme',
        visible: true
      };
    });
  };

  render() {
    return (
      <ThemeStateContext.Provider
        value={{
          selectComponents: this.selectComponents,
          openThemePropsPanel: this.openThemePropsPanel,
          toggleFinder: this.toggleFinder,
          finderActive: this.state.finderActive
        }}
      >
        {this.props.children({
          theme: this.state.activeTheme,
          updateTheme: this.updateTheme,
          initialTheme: this.props.initial,
          selectComponents: this.selectComponents,
          toggleVisibility: this.toggleVisibility,
          toggleFinder: this.toggleFinder,
          visible: this.state.visible,
          finderActive: this.state.finderActive,
          activeTab: this.state.activeTab,
          setActiveTab: this.setActiveTab,
          tabs: this.state.tabs,
          toggleOpenPanel: this.toggleOpenPanel,
          setActivePreset: this.setActivePreset
        })}
      </ThemeStateContext.Provider>
    );
  }
}
