import React from 'react';
import { List, ListItem } from '@deity/falcon-ui';

export const FormErrorSummary: React.SFC<{ errors?: string[] }> = ({ errors }) =>
  errors && errors.length ? (
    <List>
      {errors.map(error => (
        <ListItem my="md" color="error" key={error}>
          {error}
        </ListItem>
      ))}
    </List>
  ) : null;
