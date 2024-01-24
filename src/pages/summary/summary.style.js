import { css } from '@emotion/css';
import { color } from 'common/styles';

export const summaryPanel = css`
  padding: 1rem 0;
  border-bottom: 1px solid ${color.darkGray};
`;

export const layerPill = css`
  padding: 0.1rem 1rem;
  background-color: #f3f2f1;
  border-radius: 2px;
  margin-right: 0.5rem;
  color: ${color.granite};
`;

export const entryCell = css`
  padding: 0.25rem 1.25rem 0.25rem 0;
`;

export const summaryEntry = css`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  min-height: 1.75rem;
`;

export const summaryEntryTitle = css`
  font-weight: 500;
  width: 12rem;
`;

export const sectionTitle = css`
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
  font-weight: 300;
`;
