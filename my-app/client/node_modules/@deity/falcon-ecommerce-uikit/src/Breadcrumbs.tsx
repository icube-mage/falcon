import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as BreadcrumbsLayout, Breadcrumb, Link, Text } from '@deity/falcon-ui';

export const Breadcrumbs: React.SFC<{ breadcrumbs: any }> = ({ breadcrumbs }) => (
  <BreadcrumbsLayout>
    {breadcrumbs.map((breadcrumb: any) => (
      <Breadcrumb key={breadcrumb.name}>
        {breadcrumb.urlPath ? (
          <Link as={RouterLink} to={breadcrumb.urlPath}>
            {breadcrumb.name}
          </Link>
        ) : (
          <Text>{breadcrumb.name}</Text>
        )}
      </Breadcrumb>
    ))}
  </BreadcrumbsLayout>
);
