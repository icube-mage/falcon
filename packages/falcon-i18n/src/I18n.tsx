import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { I18nContext } from './context';

export type I18nProps = {
  children: (t: i18next.TranslationFunction, i18n: i18next.i18n) => any;
};
export class I18n extends React.Component<I18nProps> {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.func]).isRequired
  };

  render() {
    const { children } = this.props;

    return <I18nContext.Consumer>{({ t, i18n }) => children(t, i18n)}</I18nContext.Consumer>;
  }
}
