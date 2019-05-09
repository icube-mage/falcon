import { Theme, CSSObject } from '@deity/falcon-ui';

export const toGridTemplate = (items: string[][]) => {
  const columnTemplate = items.shift();
  if (!columnTemplate) return;

  const gridAreas = items
    .map(item => {
      const rowTemplate = item.length > columnTemplate.length ? item.pop() : '';
      return `"${item.join(' ')}" ${rowTemplate}`;
    })
    .join(' ');

  return `${gridAreas} / ${columnTemplate.join(' ')}`;
};

export const prettyScrollbars = (theme: Theme): CSSObject => ({
  overflowY: ['auto', 'overlay'] as any,
  WebkitOverflowScrolling: 'touch',
  paddingRight: 10,
  marginRight: 6,
  '::-webkit-scrollbar': {
    width: 3,
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: theme.borderRadius.medium
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.secondaryDark
  }
});
