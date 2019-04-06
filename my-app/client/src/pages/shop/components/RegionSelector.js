import React from 'react';
import { Select, Option } from '@deity/falcon-ui';

class RegionSelector extends React.Component {
  submitAddress = value => {
    const valueSelect = parseInt(value.target.value, 10);
    this.props.form.setFieldValue(this.props.field.name, valueSelect);
  };
  render() {
    return (
      <Select value={this.props.value} onChange={this.submitAddress}>
        {this.props.items.map(x => (
          <Option key={x.name} value={x.id}>
            {x.name}
          </Option>
        ))}
      </Select>
    );
  }
}

export default RegionSelector;
