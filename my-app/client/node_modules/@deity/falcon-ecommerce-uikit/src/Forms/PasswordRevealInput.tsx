import React from 'react';
import { I18n } from '@deity/falcon-i18n';
import { Input, Icon, Box, ThemedComponentProps } from '@deity/falcon-ui';

export class PasswordRevealInput extends React.Component<
  ThemedComponentProps & React.InputHTMLAttributes<HTMLInputElement>,
  { isRevealed: boolean }
> {
  state = {
    isRevealed: false
  };

  toggleInputType = () => {
    this.setState(state => ({
      isRevealed: !state.isRevealed
    }));
  };

  render() {
    const { isRevealed } = this.state;
    const inputType = isRevealed ? 'text' : 'password';

    return (
      <I18n>
        {t => (
          <Box position="relative">
            <Input {...this.props} type={inputType} />
            <Box
              position="absolute"
              top={0}
              bottom={0}
              right={0}
              title={t('form.passwordRevealTitle', { context: isRevealed ? 'hide' : 'show' })}
            >
              <Icon
                onClick={this.toggleInputType}
                stroke={isRevealed ? 'primary' : 'black'}
                cursor="pointer"
                size="md"
                src={isRevealed ? 'eye' : 'eyeOff'}
                bg="white"
                m="xs"
              />
            </Box>
          </Box>
        )}
      </I18n>
    );
  }
}
