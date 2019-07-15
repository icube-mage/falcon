import React from 'react';
import { themed, Box, H3, Text, Group, Input, Button, Checkbox, Label } from '@deity/falcon-ui';
import { T, I18n } from '@deity/falcon-i18n';

export const NewsletterLayout = themed({
  tag: 'div',
  defaultProps: {
    bgFullWidth: 'secondaryLight',
    py: 'md',
    gridGap: 'sm',
    display: 'grid',
    gridTemplateColumns: '1fr',
    css: {
      maxWidth: 560,
      margin: '0 auto',
      justifyItems: 'center'
    }
  }
});

export const Newsletter: React.SFC<{}> = () => (
  <NewsletterLayout>
    <H3>
      <T id="newsletter.title" />
    </H3>
    <Text>
      <T id="newsletter.message" />
    </Text>
    <I18n>
      {t => (
        <Box as="form" justifySelf="stretch">
          <Group>
            <Input
              type="email"
              required
              height="lg"
              aria-label={t('newsletter.emailPlaceholder')}
              placeholder={t('newsletter.emailPlaceholder')}
            />
            <Button as="input" type="submit" value={t('newsletter.subscribe')} flex="none" />
          </Group>
          <Label htmlFor="subscribe" my="sm" display="flex" justifyContent="center" alignItems="center">
            <Checkbox id="subscribe" required mr="xs" /> {t('newsletter.consent')}
          </Label>
        </Box>
      )}
    </I18n>
  </NewsletterLayout>
);
