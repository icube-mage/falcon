import React from 'react';
import { Select, Option } from '@deity/falcon-ui';
import { Country } from '.';

export type CountrySelectorProps = {
  id?: string;
  name?: string;
  items: Country[];
  value: string;
  onChange?: (value: string, country?: Country) => void;
};

export const CountrySelector: React.SFC<CountrySelectorProps> = props => {
  const { items, value, onChange, ...restProps } = props;

  return (
    <Select
      {...restProps}
      value={value}
      onChange={({ target }) => onChange && onChange(target.value, items.find(x => x.code === value))}
    >
      {items.map(x => (
        <Option key={x.localName} value={x.code}>
          {x.localName}
        </Option>
      ))}
    </Select>
  );
};
