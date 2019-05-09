import React from 'react';
import { themed, Dropdown, DropdownLabel, DropdownMenu, DropdownMenuItem, Box } from '@deity/falcon-ui';
import { T, I18n } from '@deity/falcon-i18n';
import { BackendConfigQuery, SetLocaleMutation } from '../BackendConfig';

export const LanguageSection = themed({
  tag: Box,
  defaultTheme: {
    languageSection: {
      bgFullWidth: 'secondaryLight',
      py: 'md',
      css: {
        maxWidth: 190,
        margin: '0 auto',
        zIndex: 2
      }
    }
  }
});

export type LocaleItem = {
  code: string;
  name: string;
};

type LocaleSwitcherDropdownProps = {
  items: LocaleItem[];
  value: LocaleItem;
  onChange?: (x: LocaleItem) => any;
};

export const LocaleSwitcherDropdown: React.SFC<LocaleSwitcherDropdownProps> = ({ items, value, onChange }) => (
  <Dropdown onChange={onChange}>
    <DropdownLabel>{value.name}</DropdownLabel>
    <DropdownMenu variant="above">
      {items.map(x => (
        <DropdownMenuItem key={x.code} value={x}>
          {x.name}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  </Dropdown>
);

export const addCimodeLocale = (locales: string[]) => {
  if (process.env.NODE_ENV === 'development') {
    if (!locales.find(x => x === 'cimode')) {
      locales.unshift('cimode');
    }
  }

  return locales;
};

export type LocaleSwitcherRenderProps = {
  onChange: (value: LocaleItem) => Promise<void>;
  value: LocaleItem;
  items: LocaleItem[];
};
export type LocaleSwitcherProps = {
  children: (props: LocaleSwitcherRenderProps) => any;
};
export const LocaleSwitcher: React.SFC<LocaleSwitcherProps> = ({ children }) => (
  <I18n>
    {(t, i18n) => (
      <SetLocaleMutation>
        {setLocale => (
          <BackendConfigQuery passLoading>
            {({ backendConfig: { locales, activeLocale } }) => {
              const items = addCimodeLocale(locales).map(x => ({ code: x, name: t(`languages.${x}`) }));
              const value = { code: activeLocale, name: t(`languages.${activeLocale}`) };
              const onChange = (x: LocaleItem) =>
                setLocale({ variables: { locale: x.code } }).then(({ data }: any) => {
                  i18n.changeLanguage(data.setLocale.activeLocale);
                });

              return children && children({ items, value, onChange });
            }}
          </BackendConfigQuery>
        )}
      </SetLocaleMutation>
    )}
  </I18n>
);
