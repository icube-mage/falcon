// TODO: when new i18n support is ready use it to translate validation messages
const validEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const requiredValidator = function requiredValidator(value, label) {
  return !value ? `${label} is required` : undefined;
};
export const emailValidator = function emailValidator(value) {
  if (!value || !validEmailRegex.test(value.toLowerCase())) {
    return ' Email is invalid';
  }

  return undefined;
};
const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
export const passwordValidator = function passwordValidator(value) {
  if (!value || value.length < 8) {
    return 'Please enter a password with at least 8 characters';
  }

  if (!validPasswordRegex.test(value)) {
    return 'Please use at least one lower, upper case char and digit';
  }

  return undefined;
};
const validPhoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
export const telephoneValidator = function telephoneValidator(value) {
  if (!value) {
    return 'Telephone is required';
  }
  if (!validPhoneRegex.test(value)) {
    return 'Please enter phone number exactly';
  }
  return undefined;
};
const validZipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
export const zipCodeValidator = function zipCodeValidator(value) {
  if (!value) {
    return 'Post code is required';
  }
  if (!validZipCodeRegex.test(value)) {
    return 'Please enter post code exactly';
  }
  return undefined;
};
export const getDefaultInputTypeValidator = function getDefaultInputTypeValidator(inputType) {
  switch (inputType) {
    case 'password':
      return passwordValidator;
    case 'email':
      return emailValidator;
    case 'telephone':
      return telephoneValidator;
    case 'zipcode':
      return zipCodeValidator;
    default:
      return undefined;
  }
};

// # sourceMappingURL=validators.js.map
