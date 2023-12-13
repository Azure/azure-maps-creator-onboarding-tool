import { color, fontSize, fontWeight } from 'common/styles';

export const breadcrumbStyle = {
  root: { margin: '0.625rem 0px', lineHeight: '1rem' },
  itemLink: {
    color: color.accent.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.normal,
    lineHeight: '1rem',
    selectors: {
      ':last-child': {
        color: color.accent.primary,
        fontSize: fontSize.md,
        fontWeight: fontWeight.normal,
        lineHeight: '1rem',
      },
      ':hover': { background: 'transparent', color: color.accent.primaryDark, textDecoration: 'underline' },
      ':active:hover': { background: 'white', color: color.accent.primaryDark, textDecoration: 'underline' },
    },
  },
  listItem: {
    selectors: {
      ':last-child .ms-Breadcrumb-itemLink': { color: color.accent.primary, fontWeight: fontWeight.normal },
      ':first-child .ms-Breadcrumb-itemLink': { paddingLeft: 0 },
    },
  },
  chevron: { fontSize: '0.375rem' },
};
