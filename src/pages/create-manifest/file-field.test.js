import { render, screen, fireEvent } from '@testing-library/react';

import FileField from './file-field';

const defaultProps = {
  id: 'wootwoot',
  label: 'foobar',
  onFileSelect: jest.fn(),
  fileType: 'zip',
  onError: jest.fn(),
};

describe('FileField', () => {
  it('should render component', () => {
    const view = render(<FileField {...defaultProps} />);
    expect(view).toMatchSnapshot();
  });

  it('should show error when file is too big', () => {
    const file = {
      name: 'my zip archive.zip',
      size: 1024 * 1024 * 1024,
      type: 'application/x-zip-compressed',
    };
    render(<FileField {...defaultProps} />);
    const fileInput = screen.getByTestId(defaultProps.id);

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(defaultProps.onFileSelect).toHaveBeenCalledWith(null);
    expect(defaultProps.onError).toHaveBeenCalledWith('error.file.size.exceeded');
  });

  it('should show error when expected type is zip but uploaded json', async () => {
    const file = {
      name: 'my zip archive.zip',
      size: 1024 * 1024 * 10,
      type: 'application/x-zip-compressed',
    };
    render(<FileField {...defaultProps} fileType="json" />);
    const fileInput = screen.getByTestId(defaultProps.id);

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(defaultProps.onFileSelect).toHaveBeenCalledWith(null);
    expect(defaultProps.onError).toHaveBeenCalledWith('error.file.type.incorrect');
  });

  it('should show error when expected type is json but uploaded zip', async () => {
    const manifestJsonFile = new File(['{"foo":"bar"}'], 'manifest.json', {
      type: 'application/json',
      lastModified: Date.now(),
    });
    render(<FileField {...defaultProps} fileType="zip" />);
    const fileInput = screen.getByTestId(defaultProps.id);

    fireEvent.change(fileInput, {
      target: { files: [manifestJsonFile] },
    });

    expect(defaultProps.onFileSelect).toHaveBeenCalledWith(null);
    expect(defaultProps.onError).toHaveBeenCalledWith('error.file.type.incorrect');
  });

  it('should select file when correct file was uploaded', async () => {
    const manifestJsonFile = new File(['{"foo":"bar"}'], 'manifest.json', {
      type: 'application/json',
      lastModified: Date.now(),
    });
    render(<FileField {...defaultProps} fileType="json" />);
    const fileInput = screen.getByTestId(defaultProps.id);

    fireEvent.change(fileInput, {
      target: { files: [manifestJsonFile] },
    });

    expect(defaultProps.onFileSelect).toHaveBeenCalledWith(manifestJsonFile);
  });
});
