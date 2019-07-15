import React from 'react';
import { diff } from 'deep-object-diff';
import stringifyObject from 'stringify-object';
import { Theme, Input, FlexLayout, Icon, Button, Text } from '@deity/falcon-ui';

const CREATE_THEME_IMPORT = "import { createTheme } from '@deity/falcon-ui';";

function getThemeCustomizations(initialTheme: Theme, currentTheme: Theme) {
  const customizations = stringifyObject(diff(initialTheme as object, currentTheme), { indent: '  ' });

  return customizations;
}

function withExports(customizationsSerialized: string) {
  return `${CREATE_THEME_IMPORT}\n\nexport const theme = createTheme(${customizationsSerialized});`;
}

type ThemeDownloaderProps = {
  currentTheme: Theme;
  initialTheme: Theme;
};

function copyToClipboard(serializedCustomizations: string) {
  (window.navigator as any).clipboard.writeText(withExports(serializedCustomizations));
}

function download(serializedCustomizations: string) {
  const customizations = withExports(serializedCustomizations);
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(customizations)}`;

  const downloader = document.createElement('a');

  downloader.setAttribute('href', data);
  downloader.setAttribute('download', 'theme.js');
  downloader.click();
}

export const ThemeDownloader: React.SFC<ThemeDownloaderProps> = ({ initialTheme, currentTheme }) => {
  const serializedCustomizations = getThemeCustomizations(initialTheme, currentTheme);
  if (serializedCustomizations === '{}') {
    return <Text fontSize="md">Nothing to download yet, try making few customizations first!</Text>;
  }

  return (
    <FlexLayout css={{ height: '100%' }} flexDirection="column">
      <FlexLayout mb="sm">
        <Button mr="xs" flex="1" onClick={() => copyToClipboard(serializedCustomizations)}>
          <Icon stroke="white" src="copy" size="md" mr="sm" />
          Copy
        </Button>

        <Button ml="xs" flex="1" onClick={() => download(serializedCustomizations)}>
          <Icon size="md" mr="sm" stroke="white" css={{ strokeWidth: '4' }} src="download" />
          Download
        </Button>
      </FlexLayout>
      <Input as="textarea" flex="1" spellCheck={false} readOnly value={serializedCustomizations} />
    </FlexLayout>
  );
};
