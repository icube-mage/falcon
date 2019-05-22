import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'formik';
import { FormField, toGridTemplate } from '@deity/falcon-ecommerce-uikit';
import { Box, Button } from '@deity/falcon-ui';
import CountrySelectorRewrite from './CountrySelectorRewrite';

const AddressFormArea = {
  firstName: 'firstName',
  lastName: 'lastName',
  street1: 'street1',
  street2: 'street2',
  number: 'number',
  postCode: 'postCode',
  city: 'city',
  email: 'email',
  phone: 'phone',
  region: 'region',
  country: 'country',
  submit: 'submit'
};

const addressFormLayout = {
  addressFormLayout: {
    display: 'grid',
    gridGap: 'sm',
    my: 'xs',
    fontSize: 'xs',
    // prettier-ignore
    gridTemplate:  toGridTemplate([
      ['1fr'                      ],
      [AddressFormArea.email      ],
      [AddressFormArea.firstName  ],
      [AddressFormArea.lastName   ],
      [AddressFormArea.street1    ],
      [AddressFormArea.street2    ],
      [AddressFormArea.number     ],
      [AddressFormArea.postCode   ],
      [AddressFormArea.city       ],
      [AddressFormArea.phone      ],
      [AddressFormArea.country    ],
      [AddressFormArea.submit     ]
    ])
  }
};

const AddressForm = ({ countries = [], submitLabel = 'Save', id = '', autoCompleteSection, email = '' }) => {
  const getAutoComplete = attribute => [autoCompleteSection, attribute].filter(x => x).join(' ');

  return (
    <Form id={id} defaultTheme={addressFormLayout}>
      <FormField name="email" value={`${email}`} type="email" label="Email" required gridArea={AddressFormArea.email} />
      <FormField
        name="firstname"
        label="First name"
        required
        autoComplete={getAutoComplete('given-name')}
        gridArea={AddressFormArea.firstName}
      />
      <FormField
        name="lastname"
        label="Last name"
        required
        autoComplete={getAutoComplete('family-name')}
        gridArea={AddressFormArea.lastName}
      />
      <FormField
        name="street1"
        label="Street Line 1"
        required
        autoComplete={getAutoComplete('address-line1')}
        gridArea={AddressFormArea.street1}
      />
      <FormField
        name="street2"
        label="Street Line 2"
        autoComplete={getAutoComplete('address-line2')}
        gridArea={AddressFormArea.street2}
      />
      <Field
        name="countryId"
        render={({ field, form }) => (
          <Box gridArea={AddressForm.country}>
            <CountrySelectorRewrite
              form={form}
              field={field}
              id={`${id}-${field.name}`}
              id_form={id}
              items={countries}
              value={field.value}
            />
          </Box>
        )}
      />
      <FormField
        name="postcode"
        label="Post code"
        required
        autoComplete={getAutoComplete('postal-code')}
        gridArea={AddressFormArea.postCode}
      />
      <FormField
        name="telephone"
        label="Phone"
        required
        autoComplete={getAutoComplete('tel')}
        gridArea={AddressFormArea.phone}
      />
      <Box gridArea={AddressFormArea.submit}>
        <Button type="submit">{submitLabel}</Button>
      </Box>
    </Form>
  );
};

AddressForm.propTypes = {
  id: PropTypes.string.isRequired,
  submitLabel: PropTypes.string,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      localName: PropTypes.string,
      code: PropTypes.string
    })
  )
};

export default AddressForm;
