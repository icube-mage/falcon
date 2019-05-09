import React from 'react';
import { BackendConfigQuery } from './../BackendConfig';

type LocaleContextType = {
  locale: string;
  currency: string;
};

export const LocaleContext = React.createContext<LocaleContextType>({
  locale: 'en',
  currency: 'EUR'
});

export type LocaleProviderProps = {
  currency?: string;
};
export const LocaleProvider: React.SFC<LocaleProviderProps> = ({ children, ...props }) => (
  <BackendConfigQuery>
    {({
      backendConfig: {
        activeLocale: locale,
        shop: { activeCurrency: currency }
      }
    }) => <LocaleContext.Provider value={{ locale, currency, ...props }}>{children}</LocaleContext.Provider>}
  </BackendConfigQuery>
);
