import React from 'react';
import { Formik } from 'formik';
import { T } from '@deity/falcon-i18n';
import { Text, Button, GridLayout, H1, Box } from '@deity/falcon-ui';
import { FormField, Form, FormSubmit, FormErrorSummary, PasswordRevealInput } from '../Forms';
import { ResetCustomerPasswordMutation, ResetCustomerPasswordVariables } from './AccountRecoveryMutations';
import { ValidatePasswordTokenQuery } from './AccountRecoveryQueries';
import { OpenSidebarMutation } from '../Sidebar';
import { MiniFormLayout } from '../MiniAccount';

type ResetPasswordProps = {
  resetToken: string;
};
export const ResetPassword: React.SFC<ResetPasswordProps> = ({ resetToken }) => (
  <ValidatePasswordTokenQuery variables={{ token: resetToken }}>
    {({ validatePasswordToken }) => {
      const tokenIsInvalid = !validatePasswordToken;

      return (
        <GridLayout gridGap="md" py="md">
          <H1 justifySelf="center">
            <T id="resetPassword.title" />
          </H1>
          {tokenIsInvalid && <InvalidToken />}
          {!tokenIsInvalid && <ResetPasswordForm resetToken={resetToken} />}
        </GridLayout>
      );
    }}
  </ValidatePasswordTokenQuery>
);

export const InvalidToken: React.SFC = () => (
  <OpenSidebarMutation>
    {openSidebar => (
      <React.Fragment>
        <Text justifySelf="center" fontSize="md" color="error">
          <T id="resetPassword.failureMessage" />
        </Text>
        <Box justifySelf="center">
          <Button onClick={() => openSidebar({ variables: { contentType: 'forgotPassword' } })}>
            <T id="resetPassword.requestAnotherToken" />
          </Button>
        </Box>
      </React.Fragment>
    )}
  </OpenSidebarMutation>
);

export const ResetPasswordForm: React.SFC<ResetPasswordProps> = ({ resetToken }) => (
  <ResetCustomerPasswordMutation>
    {(resetCustomerPassword, { loading, error, called }) => {
      const submitSucceed = called && !loading && !error;
      if (submitSucceed) {
        return <ResetPasswordSuccess />;
      }

      return (
        <Formik
          initialValues={{ resetToken, password: '' } as ResetCustomerPasswordVariables}
          onSubmit={values => resetCustomerPassword({ variables: { input: values } })}
        >
          {() => (
            <MiniFormLayout>
              <Form id="reset-password" i18nId="resetPassword">
                <FormField name="password" required type="password" autoComplete="new-password">
                  {({ field }) => <PasswordRevealInput {...field} />}
                </FormField>
                <FormSubmit justifySelf="center" submitting={loading} value="Reset my password" />
                <FormErrorSummary errors={error && [error.message]} />
              </Form>
            </MiniFormLayout>
          )}
        </Formik>
      );
    }}
  </ResetCustomerPasswordMutation>
);

const ResetPasswordSuccess: React.SFC = () => (
  <OpenSidebarMutation>
    {openSidebar => (
      <React.Fragment>
        <Text justifySelf="center" fontSize="md">
          <T id="resetPassword.successMessage" />
        </Text>
        <Box justifySelf="center">
          <Button onClick={() => openSidebar({ variables: { contentType: 'account' } })}>
            <T id="signIn.button" />
          </Button>
        </Box>
      </React.Fragment>
    )}
  </OpenSidebarMutation>
);
