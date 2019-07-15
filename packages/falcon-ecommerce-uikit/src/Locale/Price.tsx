import React from 'react';
import { themed, Text } from '@deity/falcon-ui';
import { LocaleContext } from './LocaleContext';

// Price formatting based on Intl api, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
const PriceInnerDom: React.SFC<any> = ({ value, currency, locale, ...rest }) => (
  <LocaleContext.Consumer>
    {localeContext => {
      const localeCode = locale || localeContext.locale;
      const localFallback = 'en';

      return (
        <Text {...rest}>
          {new Intl.NumberFormat([localeCode, localFallback], {
            style: 'currency',
            currency: currency || localeContext.currency
          }).format(value)}
        </Text>
      );
    }}
  </LocaleContext.Consumer>
);

export const Price = themed({
  tag: PriceInnerDom,
  defaultProps: {
    ellipsis: false
  },
  defaultTheme: {
    price: {
      display: 'block',
      m: 'none',
      css: {
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }
    }
  }
});
