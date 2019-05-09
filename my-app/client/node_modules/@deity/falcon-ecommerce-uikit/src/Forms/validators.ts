export type Validator = (value: string, label: string) => string | undefined;

// TODO: when new i18n support is ready use it to translate validation messages

const validEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const requiredValidator: Validator = (value, label) => (!value ? `${label} is required` : undefined);

export const emailValidator: Validator = value => {
  if (!value || !validEmailRegex.test(value.toLowerCase())) {
    return ' Email is invalid';
  }

  return undefined;
};

const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const passwordValidator: Validator = value => {
  if (!value || value.length < 8) {
    return 'Please enter a password with at least 8 characters';
  }

  if (!validPasswordRegex.test(value)) {
    return 'Please use at least one lower, upper case char and digit';
  }
  return undefined;
};

export const getDefaultInputTypeValidator = (inputType: string | undefined): Validator | undefined => {
  switch (inputType) {
    case 'password':
      return passwordValidator;
    case 'email':
      return emailValidator;
    default:
      return undefined;
  }
};
