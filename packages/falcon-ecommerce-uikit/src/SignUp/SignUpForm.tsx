import React from 'react';
import { Formik } from 'formik';
import { SignUpMutation, SignUpVariables } from './SignUpMutation';
import { FormField, Form, FormSubmit, FormErrorSummary, PasswordRevealInput } from '../Forms';

type SignUpFormProps = {
  onCompleted?: () => void;
};

export const SignUpForm: React.SFC<SignUpFormProps> = ({ onCompleted }) => (
  <SignUpMutation onCompleted={onCompleted}>
    {(signUp, { loading, error }) => (
      <Formik
        // initial values need to be set because of: https://github.com/jaredpalmer/formik/issues/738
        initialValues={
          {
            firstname: '',
            lastname: '',
            email: '',
            password: ''
          } as SignUpVariables
        }
        onSubmit={(values: SignUpVariables) => {
          signUp({ variables: { input: { ...values, autoSignIn: true } } });
        }}
      >
        {() => (
          <Form id="sign-up" i18nId="signUp">
            <FormField name="firstname" type="text" required autoComplete="given-name" />
            <FormField name="lastname" type="text" required autoComplete="family-name" />
            <FormField name="email" type="email" required autoComplete="email" />

            <FormField name="password" required type="password" autoComplete="new-password">
              {({ field }) => <PasswordRevealInput {...field} />}
            </FormField>

            <FormSubmit submitting={loading} value="Create an account" />
            <FormErrorSummary errors={error && [error.message]} />
          </Form>
        )}
      </Formik>
    )}
  </SignUpMutation>
);
