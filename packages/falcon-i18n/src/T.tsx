import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { I18nContext } from './context';

export type TProps = {
  id: string;
} & i18next.TranslationOptions;

export class T extends React.Component<TProps> {
  static propTypes = {
    id: PropTypes.string.isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.string]),
    count: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    context: PropTypes.any, // used for contexts (eg. male\female)
    replace: PropTypes.shape({}), // object with vars for interpolation - or put them directly in options
    lng: PropTypes.string,
    lngs: PropTypes.arrayOf(PropTypes.string),
    fallbackLng: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    ns: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    keySeparator: PropTypes.string,
    nsSeparator: PropTypes.string,
    returnObjects: PropTypes.bool, // accessing an object not a translation string
    joinArrays: PropTypes.string, // char, eg. '\n' that arrays will be joined by (can be set globally too)
    postProcess: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]), // postProcessors to apply see interval plurals as a sample
    interpolation: PropTypes.shape({})
  };

  render() {
    const { id, ...translationOptions } = this.props;

    return <I18nContext.Consumer>{({ t }) => t(id, translationOptions)}</I18nContext.Consumer>;
  }
}
