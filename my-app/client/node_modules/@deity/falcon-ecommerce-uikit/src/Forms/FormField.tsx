import React from 'react';
import { FieldProps as FormikFieldProps } from 'formik';
import {
  Box,
  Label,
  Input,
  Checkbox,
  Radio,
  FlexLayout,
  extractThemableProps,
  ThemedComponentProps,
  themed
} from '@deity/falcon-ui';
import { Field } from './Field';
import { toGridTemplate } from '../helpers';
import { Validator, requiredValidator, getDefaultInputTypeValidator } from './validators';

export const FormFieldArea = {
  label: 'label',
  input: 'input',
  error: 'error'
};

export const FormFieldLayout = themed({
  tag: Box,
  defaultTheme: {
    formFieldLayout: {
      display: 'grid',
      gridGap: 'xs',
      // prettier-ignore
      gridTemplate: toGridTemplate([
        ['1fr'                     ],
        [FormFieldArea.label       ],
        [FormFieldArea.input       ],
        [FormFieldArea.error, '0px']
      ])
    }
  }
});

export const FormFieldLabel = themed({
  tag: Label,
  defaultProps: {
    gridArea: FormFieldArea.label
  }
});

export const FormFieldError = themed({
  tag: Box,
  defaultProps: {
    gridArea: FormFieldArea.error
  },
  defaultTheme: {
    formFieldError: {
      gridArea: FormFieldArea.error,
      color: 'error',
      fontSize: 'xxs',
      css: {
        pointerEvents: 'none',
        justifySelf: 'end'
      }
    }
  }
});

export type FormFieldRenderProps<TValue = any> = {
  form: FormikFieldProps<TValue>['form'] & {
    id?: number | string;
  };
  field: FormikFieldProps<TValue>['field'] &
    React.InputHTMLAttributes<HTMLInputElement> &
    ThemedComponentProps & {
      id?: string;
      placeholder?: string;
      invalid: boolean;
    };
};

export type FormFieldProps<TValue = any> = {
  id?: number | string;
  name: string;
  label?: string;
  placeholder?: string;
  validate?: Validator[];
  children?: (props: FormFieldRenderProps<TValue>) => React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
  ThemedComponentProps;

export const FormField: React.SFC<FormFieldProps> = props => {
  const { name, validate, required, children, ...restProps } = props;
  const { themableProps, rest } = extractThemableProps(restProps);

  // eslint-disable-next-line
  let validators = validate || [];
  if (required) {
    validators.unshift(requiredValidator);
  }
  const defaultInputTypeValidator = !validate && getDefaultInputTypeValidator(restProps.type);
  if (defaultInputTypeValidator) {
    validators.push(defaultInputTypeValidator);
  }

  return (
    <Field name={name} validate={validators} {...rest}>
      {({ form, field, label, error }) => (
        <FormFieldLayout {...themableProps}>
          {label && <FormFieldLabel htmlFor={field.id}>{label}</FormFieldLabel>}
          {children ? (
            children({ form, field: { ...field, gridArea: FormFieldArea.input } })
          ) : (
            <Input {...field} gridArea={FormFieldArea.input} />
          )}
          <FormFieldError>{field.invalid ? error : null}</FormFieldError>
        </FormFieldLayout>
      )}
    </Field>
  );
};

export const CheckboxFormFieldLayout = themed({
  tag: Box,
  defaultTheme: {
    checkboxFormFieldLayout: {
      display: 'grid',
      gridGap: 'xs',
      // prettier-ignore
      gridTemplate: toGridTemplate([
        ['auto',             '1fr'                      ],
        [FormFieldArea.input, FormFieldArea.label       ],
        [FormFieldArea.error, FormFieldArea.error, '0px']
      ])
    }
  }
});

export const CheckboxFormField: React.SFC<FormFieldProps> = props => {
  const { name, validate, required, children, ...restProps } = props;
  const { themableProps, rest } = extractThemableProps(restProps);

  // eslint-disable-next-line
  let validators = validate || [];
  if (required) {
    validators.unshift(requiredValidator);
  }
  const defaultInputTypeValidator = !validate && getDefaultInputTypeValidator(restProps.type);
  if (defaultInputTypeValidator) {
    validators.push(defaultInputTypeValidator);
  }

  return (
    <Field name={name} validate={validators} {...rest}>
      {({ form, field, label, error }) => (
        <CheckboxFormFieldLayout {...themableProps}>
          <Checkbox
            {...field}
            gridArea={FormFieldArea.input}
            checked={field.value}
            onChange={e => form.setFieldValue(field.name, e.target.checked)}
          />
          <FlexLayout alignItems="center" gridArea={FormFieldArea.label}>
            <Label htmlFor={field.id}>{label}</Label>
          </FlexLayout>

          <FormFieldError>{field.invalid ? error : null}</FormFieldError>
        </CheckboxFormFieldLayout>
      )}
    </Field>
  );
};

export const RadioFormFieldLayout = themed({
  tag: Box,
  defaultTheme: {
    radioFormFieldLayout: {
      display: 'grid',
      gridGap: 'xs',
      // prettier-ignore
      gridTemplate: toGridTemplate([
        ['auto', '1fr'],
        [FormFieldArea.input, FormFieldArea.label],
        [FormFieldArea.error, FormFieldArea.error, '0px']
      ])
    }
  }
});

export const RadioFormField: React.SFC<FormFieldProps> = props => {
  const { name, value, validate, required, children, ...restProps } = props;
  const { themableProps, rest } = extractThemableProps(restProps);

  // eslint-disable-next-line
  let validators = validate || [];
  if (required) {
    validators.unshift(requiredValidator);
  }
  const defaultInputTypeValidator = !validate && getDefaultInputTypeValidator(restProps.type);
  if (defaultInputTypeValidator) {
    validators.push(defaultInputTypeValidator);
  }

  return (
    <Field name={name} validate={validators} {...rest}>
      {({ field, label }) => (
        <RadioFormFieldLayout {...themableProps}>
          <Radio {...field} value={value} checked={value === field.value} gridArea={FormFieldArea.input} />
          <FlexLayout alignItems="center" gridArea={FormFieldArea.label}>
            <Label htmlFor={field.id}>{children || label}</Label>
          </FlexLayout>
        </RadioFormFieldLayout>
      )}
    </Field>
  );
};
