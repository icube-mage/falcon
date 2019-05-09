import React from 'react';
import { Form as FormikForm, FormikFormProps } from 'formik';
import { ThemedComponentProps, DefaultThemeProps, Box } from '@deity/falcon-ui';

export type FormContextValue = {
  id: string;
  name?: string;
  i18nId?: string;
};

export const FormContext = React.createContext<FormContextValue>({} as any);

export type FormProps = { id: string; name?: string; i18nId?: string } & FormikFormProps & ThemedComponentProps;

const formLayout: DefaultThemeProps = {
  formLayout: {
    display: 'grid',
    gridGap: 'sm'
  }
};
export const Form: React.SFC<FormProps> = props => {
  const { i18nId, ...restProps } = props;

  return (
    <FormContext.Provider value={{ id: props.id, name: props.name, i18nId: props.i18nId }}>
      <Box as={FormikForm as any} defaultTheme={formLayout} {...restProps} />
    </FormContext.Provider>
  );
};
