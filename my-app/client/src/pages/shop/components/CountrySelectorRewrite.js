import React from 'react';
import { CountrySelector, FormField } from '@deity/falcon-ecommerce-uikit';
import { Field, ErrorMessage } from 'formik';
import { Box, Label, Option, Select, Text } from '@deity/falcon-ui';
import AddressForm from '../components/AddressForm';
import { RegionQuery } from '../components/RegionQuery';
import { CityQuery } from '../components/CityQuery';

const AddressFormArea = {
  firstName: 'firstName',
  lastName: 'lastName',
  street: 'street',
  number: 'number',
  postCode: 'postCode',
  city: 'city',
  email: 'email',
  phone: 'phone',
  region: 'region',
  country: 'country',
  submit: 'submit',
  kecamatan: 'kecamatan'
};

const CountriesCode = {
  Indonesia: 'ID'
};

class CountrySelectorRewrite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regions: [],
      textOrSelect: 'text',
      selectedRegion: 0,
      selectedCity: 'selectedCity'
    };
  }

  findArrayElementByTitle = (array, codeId) => array.find(element => element.code === codeId);

  submitRegions = value => {
    const valueSelect = parseInt(value.target.value, 10);
    this.setState({
      selectedRegion: valueSelect
    });
    this.props.form.setFieldValue('regionId', valueSelect);
  };

  submitCities = value => {
    const valueSelect = value.target.value;
    this.setState({
      selectedCity: valueSelect
    });
    this.props.form.setFieldValue('city', valueSelect);
  };

  submitKecamatans = value => {
    const valueSelect = value.target.value;
    this.props.form.setFieldValue('city', `${this.state.selectedCity}/${valueSelect}`);
  };

  submitAddress = value => {
    this.props.form.setFieldValue(this.props.field.name, value);
    if (value === CountriesCode.Indonesia) {
      let regionsArr = [];
      const countries = this.props.items;
      countries.forEach(country => {
        if (country.code === value) {
          regionsArr = country.regions;
          this.setState({
            regions: regionsArr,
            textOrSelect: 'select'
          });
        }
      });
    } else {
      this.setState({
        textOrSelect: 'text',
        selectedRegion: 0
      });
      this.props.form.setFieldValue('regionId', 0);
    }
  };
  render() {
    if (this.state.textOrSelect === 'text') {
      return (
        <Box>
          <CountrySelector
            id={this.props.id}
            items={this.props.items}
            value={this.props.value}
            onChange={this.submitAddress}
          />
          <FormField
            name="region"
            label="Region"
            id={`${this.props.id_form}-region`}
            gridArea={AddressFormArea.region}
          />
          <FormField
            name="city"
            label="City"
            id={`${this.props.id_form}-city`}
            required
            gridArea={AddressFormArea.city}
          />
        </Box>
      );
    }
    return (
      <Box>
        <CountrySelector
          id={this.props.id}
          items={this.props.items}
          value={this.props.value}
          onChange={this.submitAddress}
        />
        <Field
          name="regionId"
          render={({ field }) => (
            <Box gridArea={AddressForm.region}>
              <Label htmlFor={this.props.id}>Region</Label>
              <Select value={field.value} field={field} onChange={this.submitRegions}>
                <Option>Please choose region!</Option>
                {this.state.regions.map(x => (
                  <Option key={x.name} value={x.id}>
                    {x.name}
                  </Option>
                ))}
              </Select>
              <ErrorMessage
                name={field.name}
                render={msg => (
                  <Text fontSize="xs" color="error">
                    {msg}
                  </Text>
                )}
              />
            </Box>
          )}
        />
        <RegionQuery
          variables={{
            regionId: this.state.selectedRegion
          }}
          regions={this.state.selectedRegion}
        >
          {({ loves }) => (
            <Field
              name="cityId"
              render={({ field }) => (
                <Box gridArea={AddressForm.region}>
                  <Label htmlFor={this.props.id}>City *</Label>
                  <Select value={field.value} field={field} onChange={this.submitCities}>
                    <Option>Please choose city!</Option>
                    {loves.items.map(x => (
                      <Option key={x.name} value={x.name}>
                        {x.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage
                    name={field.name}
                    render={msg => (
                      <Text fontSize="xs" color="error">
                        {msg}
                      </Text>
                    )}
                  />
                </Box>
              )}
            />
          )}
        </RegionQuery>
        <CityQuery
          variables={{
            cityId: this.state.selectedCity
          }}
          cities={this.state.selectedCity}
        >
          {({ kecamatans }) => (
            <Field
              name="kecamatanId"
              render={({ field }) => (
                <Box gridArea={AddressForm.region}>
                  <Label htmlFor={this.props.id}>Kecamatan</Label>
                  <Select value={field.value} field={field} onChange={this.submitKecamatans}>
                    <Option>Please choose kecamatan!</Option>
                    {kecamatans.items.map(x => (
                      <Option key={x.name} value={x.name}>
                        {x.name}
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage
                    name={field.name}
                    render={msg => (
                      <Text fontSize="xs" color="error">
                        {msg}
                      </Text>
                    )}
                  />
                </Box>
              )}
            />
          )}
        </CityQuery>
      </Box>
    );
  }
}

export default CountrySelectorRewrite;
