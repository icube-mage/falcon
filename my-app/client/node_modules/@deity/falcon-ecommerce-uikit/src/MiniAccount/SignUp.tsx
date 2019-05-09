import React from 'react';
import { I18n } from '@deity/falcon-i18n';
import { OpenSidebarMutation } from '../Sidebar';
import { SignUpForm } from '../SignUp';
import { MiniFormLayout } from './MiniFormLayout';

export const SignUp = () => (
  <I18n>
    {t => (
      <MiniFormLayout title={t('signUp.title')}>
        <OpenSidebarMutation>
          {openSidebarMutation => (
            <SignUpForm onCompleted={() => openSidebarMutation({ variables: { contentType: 'account' } })} />
          )}
        </OpenSidebarMutation>
      </MiniFormLayout>
    )}
  </I18n>
);
