import React from 'react';
import { Box, Button, ThemedComponentProps } from '@deity/falcon-ui';

export const FormSubmit: React.SFC<{ submitting: boolean; value: string } & ThemedComponentProps> = ({
  submitting,
  value,
  children,
  ...rest
}) => (
  <Box justifySelf="end" mt="md" {...rest as any}>
    {children || (
      <Button type="submit" variant={submitting ? 'loader' : undefined}>
        {value}
      </Button>
    )}
  </Box>
);
