import React from 'react';
import { Formik } from 'formik';
import { Button, FlexLayout } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';

import { FormField, Form, PasswordRevealInput, FormErrorSummary } from '../Forms';
import { SignInMutation } from './SignInMutation';
import { ForgotPasswordTrigger } from './ForgotPasswordTrigger';

type SignInFormProps = {
  id: string;
  onCompleted?: () => void;
};

export const SignInForm: React.SFC<SignInFormProps> = ({ onCompleted, id }) => (
  <SignInMutation>
    {(signIn, { loading, error }) => (
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={values => signIn({ variables: { input: values } }).then(() => onCompleted && onCompleted())}
      >
        {() => (
          <Form id={id} i18nId="signIn">
            <FormField name="email" type="email" required autoComplete="email" />
            <FormField
              name="password"
              type="password"
              // pass empty array, so default password strength validator does not get triggered
              validate={[]}
              required
              autoComplete="current-password"
            >
              {({ field }) => <PasswordRevealInput {...field} />}
            </FormField>
            <FlexLayout justifyContent="space-between" alignItems="center" mt="md">
              <ForgotPasswordTrigger />
              <Button type="submit" variant={loading ? 'loader' : undefined}>
                <T id="signIn.button" />
              </Button>
            </FlexLayout>

            <FormErrorSummary errors={error && [error.message]} />
          </Form>
        )}
      </Formik>
    )}
  </SignInMutation>
);
