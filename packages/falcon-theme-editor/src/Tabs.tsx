import React from 'react';
import { FlexLayout, Box, Text, Icon } from '@deity/falcon-ui';

export type TabKeys = 'theme' | 'component' | 'presets' | 'download';

type Tab = {
  name: string;
  key: TabKeys;
};

type ThemeEditorTabsProps = {
  onChange: (tabKey: TabKeys) => void;
  active: TabKeys;
};

const tabs: Tab[] = [
  {
    name: 'Theme',
    key: 'theme'
  },
  {
    name: 'Component',
    key: 'component'
  },
  {
    name: 'Presets',
    key: 'presets'
  },
  {
    name: 'Download',
    key: 'download'
  }
];

export const Tabs: React.SFC<ThemeEditorTabsProps> = ({ active, onChange }) => (
  <FlexLayout pr="sm" justifyContent="space-between" css={{ textAlign: 'center' }}>
    {tabs.map(tab => (
      <Box key={tab.key} css={{ cursor: 'pointer' }} onClick={() => onChange(tab.key)}>
        <Icon
          src={tab.key}
          stroke={tab.key === active ? 'primary' : 'black'}
          fill={tab.key === active ? 'primary' : 'black'}
          transitionTimingFunction="easeIn"
          transitionDuration="short"
          css={{ strokeWidth: 2, transitionProperty: 'all' }}
        />
        <Text fontSize="xs" color={tab.key === active ? 'primary' : 'black'}>
          {tab.name}
        </Text>
      </Box>
    ))}
  </FlexLayout>
);
