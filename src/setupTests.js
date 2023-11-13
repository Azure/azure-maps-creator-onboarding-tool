// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { onMessage } from 'common/store/geometry.store.worker';

initializeIcons();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
  Trans: props => <div>{props.i18nKey}</div>,
}));
jest.mock('common/translations/i18n', () => ({
  t: key => key,
}));
jest.mock('common/store/geometry.store.worker-builder', () => () => new MockWorker());
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));
jest.mock('@zip.js/zip.js', () => ({
  BlobWriter: class {},
  BlobReader: class {},
  ZipWriter: class {
    add() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
  },
  ZipReader: class {
    getEntries() {
      return Promise.resolve([]);
    }
  },
}));

global.fetch = jest.fn();

function MockWorker() {
  this.postMessage = d => {
    this.onmessage({ data: onMessage(d) });
  };
}
