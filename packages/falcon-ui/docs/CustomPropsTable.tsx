import React, { Fragment, SFC } from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { withTheme } from 'emotion-theming';
import { Table, Tr, Th, H3, Tbody, Td, Thead } from '../src';

export interface Prop {
  name: string;
  required: boolean;
  description?: string;
  type: string;
  defaultValue?: string;
}
export interface PropsTableProps {
  props: Prop[];
  componentName: string;
}

export type TooltipComponent = React.ComponentType<{
  text: React.ReactNode;
  children: React.ReactNode;
}>;

const PropsTable: SFC<PropsTableProps> = props => {
  const info = props.props;

  return (
    <Fragment>
      <H3 py="lg">{props.componentName} specific props</H3>
      <Table mb="lg">
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Type</Th>
            <Th>Required</Th>
            <Th>Default</Th>
            <Th css={{ width: '40%' }}>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {info.map(prop => (
            <Tr key={prop.name}>
              <Td>{prop.name}</Td>
              <Td>{prop.type}</Td>
              <Td>{prop.required ? '🗸' : '-'}</Td>
              <Td>{prop.defaultValue}</Td>
              <Td
                css={{
                  code: {
                    background: '#f4f6f9',
                    color: '#7D899C',
                    margin: '0 3px',
                    padding: '4px 6px',
                    borderRadius: '3px',
                    fontSize: '14px',
                    fontWeight: 'normal'
                  }
                }}
              >
                <p dangerouslySetInnerHTML={{ __html: prop.description }} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Fragment>
  );
};

export default withMDXComponents(withTheme(PropsTable));
