import React from 'react';
import i18next from 'i18next';

export type I18nContextOptions = typeof defaultOptions;
export const defaultOptions = {
  rerenderOn: ['languageChanged', 'loaded', 'added', 'removed']
};

export type I18nContextValue = {
  updatedAt: Date;
  i18n: i18next.i18n;
  t: i18next.TranslationFunction;
  language: string;
  options: I18nContextOptions;
};

let i18nInstance: i18next.i18n;

export function setI18n(instance: i18next.i18n) {
  i18nInstance = instance;
}

export function getI18n(): i18next.i18n {
  return i18nInstance;
}

export const I18nContext = React.createContext<I18nContextValue>({
  updatedAt: new Date(),
  i18n: undefined as any,
  language: undefined as any,
  t: x => x,
  options: defaultOptions
});
