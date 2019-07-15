const codes = require('./src/codes');
const errors = require('./src/errors');
// IMPORTANT: code in falcon-errors in not transpiled by babel currently
// so we must stick to the syntax supported by browsers we support

const codesAndErrors = { codes };
// eslint-disable-next-line
for (const key in errors) {
  codesAndErrors[key] = errors[key];
}

module.exports = codesAndErrors;
