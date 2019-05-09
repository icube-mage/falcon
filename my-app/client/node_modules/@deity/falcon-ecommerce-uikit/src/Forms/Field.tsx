import React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps, FieldConfig, getIn } from 'formik';
import { I18n } from '@deity/falcon-i18n';
import { Validator } from './validators';
import { FormContext } from './Form';

type ValidateSequentially = { (validators: Validator[], label: string): FieldConfig['validate'] };
const validateSequentially: ValidateSequentially = (validators, label) => value => {
  const firstInvalid = validators.find(validator => validator(value, label) !== undefined);

  return firstInvalid ? firstInvalid(value, label) : undefined;
};

const LABEL_SUFFIX = 'FieldLabel';
const PLACEHOLDER_SUFFIX = 'FieldPlaceholder';

export const getLabelI18nId = (formI18nId: string, fieldName: string) => `${formI18nId}.${fieldName}${LABEL_SUFFIX}`;
export const getPlaceholderI18nId = (formI18nId: string, fieldName: string) =>
  `${formI18nId}.${fieldName}${PLACEHOLDER_SUFFIX}`;

export type FieldRenderProps<TValue = any> = {
  form: FormikFieldProps<TValue>['form'] & {
    id?: number | string;
  };
  field: FormikFieldProps<TValue>['field'] & {
    id?: string;
    placeholder?: string;
    invalid: boolean;
  };
  label?: string;
  error?: string;
  i18nIds: {
    label?: string;
    placeholder?: string;
  };
};

export type FieldProps<TValue = any> = {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  validate?: Validator[];
  children?: (props: FieldRenderProps<TValue>) => React.ReactNode;
};

export const Field: React.SFC<FieldProps> = props => {
  const { name, label, placeholder, validate, children, ...restProps } = props;

  if (!children) return null;

  return (
    <FormContext.Consumer>
      {({ id: formId, i18nId: formI18nId }) => (
        <I18n>
          {t => {
            const i18nIds = formI18nId
              ? {
                  label: getLabelI18nId(formI18nId, name),
                  placeholder: getPlaceholderI18nId(formI18nId, name)
                }
              : {};

            const translateIfExists = (key?: string) => (key ? (t(key, { defaultValue: '' }) as string) : undefined);
            const fieldLabel = label || translateIfExists(i18nIds.label);
            const fieldPlaceholder = placeholder || translateIfExists(i18nIds.placeholder);

            return (
              <FormikField name={name} validate={validateSequentially(validate || [], fieldLabel || name)}>
                {({ form: formikForm, field: formikField }: FormikFieldProps) => {
                  const touch = getIn(formikForm.touched, name);
                  const error = getIn(formikForm.errors, name);

                  return children({
                    form: { ...formikForm, id: formId },
                    field: {
                      id: `${formId}-${name}`,
                      ...restProps,
                      ...formikField,
                      placeholder: fieldPlaceholder,
                      invalid: !!touch && !!error
                    },
                    error,
                    label: fieldLabel,
                    i18nIds
                  });
                }}
              </FormikField>
            );
          }}
        </I18n>
      )}
    </FormContext.Consumer>
  );
};
