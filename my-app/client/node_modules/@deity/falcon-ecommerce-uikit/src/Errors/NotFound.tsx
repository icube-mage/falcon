import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// eslint-disable-next-line
import { Location, LocationState } from 'history';
import { T } from '@deity/falcon-i18n';
import { H1, Text, Button, FlexLayout, GridLayout } from '@deity/falcon-ui';

export type NotFoundProps<TState = LocationState> = {
  location: Location<TState>;
};
export const NotFound: React.SFC<NotFoundProps> = ({ location }) => {
  const { pathname } = location;
  const path = pathname.startsWith('/') ? pathname.substring(1) : pathname;

  return (
    <GridLayout mb="md" gridGap="md">
      <H1>
        <T id="notFound.title" />
      </H1>
      <FlexLayout flexDirection="column" alignItems="center" p="sm">
        <Text fontSize="md" mb="xs">
          <T id="notFound.text" path={path} />
        </Text>
        <Button as={RouterLink} to="/" p="xs">
          <T id="notFound.goHomeButton" />
        </Button>
      </FlexLayout>
    </GridLayout>
  );
};
