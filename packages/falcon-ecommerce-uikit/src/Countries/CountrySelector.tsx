import React from 'react';
import { Dropdown, DropdownLabel, DropdownMenu, DropdownMenuItem } from '@deity/falcon-ui';
import { Country } from '.';

export type CountrySelectorProps = {
  items: Country[];
  value: string;
  onChange?: (value: string, country?: Country) => void;
};

export const CountrySelector: React.SFC<CountrySelectorProps> = ({ items, value, onChange, ...restProps }) => {
  const selected = items.find(x => x.code === value);

  return (
    <Dropdown onChange={x => onChange && onChange(x, selected)} {...restProps}>
      <DropdownLabel>{(selected && selected.localName) || ''}</DropdownLabel>
      <DropdownMenu css={{ maxHeight: 250, overflowY: 'scroll' }}>
        {items.map(x => (
          <DropdownMenuItem key={x.localName} value={x.code}>
            {x.localName}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
