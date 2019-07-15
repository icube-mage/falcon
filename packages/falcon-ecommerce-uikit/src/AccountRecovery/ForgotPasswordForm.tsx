import React from 'react';
import { Formik } from 'formik';
import { Text } from '@deity/falcon-ui';
import { FormField, Form, FormSubmit, FormErrorSummary } from '../Forms';
import { RequestPasswordResetMutation } from './AccountRecoveryMutations';

type ForgotPasswordProps = {
  onCompleted?: () => void;
};

export const ForgotPasswordForm: React.SFC<ForgotPasswordProps> = ({ onCompleted }) => (
  <RequestPasswordResetMutation onCompleted={onCompleted}>
    {(requestPasswordReset, { loading, error, called }) => {
      const submitSucceed = called && !loading && !error;
      return (
        <Formik
          initialValues={{ email: '' }}
          onSubmit={values => requestPasswordReset({ variables: { input: { email: values.email } } })}
        >
          {({ values }) => (
            <Form id="forgot-password" i18nId="forgotPassword">
              <FormField name="email" required type="email" autoComplete="email" />
              <FormSubmit submitting={loading} value="Reset my password" />
              <FormErrorSummary errors={error && [error.message]} />

              {submitSucceed && (
                <Text mt="md" fontSize="md">
                  If there is an account associated with <b>{values.email}</b> you will receive an email with a link to
                  reset your password.
                </Text>
              )}
            </Form>
          )}
        </Formik>
      );
    }}
  </RequestPasswordResetMutation>
);
