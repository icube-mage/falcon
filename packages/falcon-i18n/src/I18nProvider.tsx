import React from 'react';
import i18next from 'i18next';
import { I18nContext, setI18n, defaultOptions } from './context';

export type I18nProviderProps = React.Props<{}> & {
  i18n: i18next.i18n;
};
type I18nProviderState = {
  updatedAt: Date;
};

export class I18nProvider extends React.Component<I18nProviderProps, I18nProviderState> {
  constructor(props) {
    super(props);

    this.state = {
      updatedAt: new Date()
    };

    this.onI18nChanged = this.onI18nChanged.bind(this);
  }

  componentDidMount() {
    const { i18n } = this.props;

    defaultOptions.rerenderOn.forEach(x => i18n.on(x, this.onI18nChanged));
  }

  componentWillUnmount() {
    const { i18n } = this.props;

    defaultOptions.rerenderOn.forEach(x => i18n.off(x, this.onI18nChanged));
  }

  onI18nChanged() {
    this.setState({ updatedAt: new Date() });
  }

  render() {
    const { i18n, children } = this.props;
    const { updatedAt } = this.state;

    setI18n(i18n);

    return (
      <I18nContext.Provider
        value={{
          updatedAt,
          i18n,
          language: i18n.language,
          t: i18n.t.bind(i18n),
          options: defaultOptions
        }}
      >
        {children}
      </I18nContext.Provider>
    );
  }
}
