import { fireEvent, render, screen } from '@testing-library/react';
import { uploadFile } from 'common/api';
import { useResponseStore } from 'common/store';
import flushPromises from 'flush-promises';
import CreateManifestPage, { TEST_ID } from './create-manifest';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => <div>{children}</div>,
}));
jest.mock('common/api', () => ({
  ...jest.requireActual('common/api'),
  uploadFile: jest.fn(),
}));

describe('CreateManifestPage', () => {
  let file;
  const state = useResponseStore.getState();
  const uploadFileSpy = jest.spyOn(state, 'uploadFile');

  beforeEach(() => {
    uploadFile.mockReturnValue(Promise.resolve({}));
    file = {
      name: 'my zip archive.zip',
      size: 1024 * 1024 * 10,
      type: 'application/x-zip-compressed',
    };
    useResponseStore.setState({
      errorMessage: 'some err',
    });
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const view = render(<CreateManifestPage />);
    expect(view).toMatchSnapshot();
  });

  it('should upload file correctly', () => {
    expect(uploadFileSpy).not.toHaveBeenCalled();
    render(<CreateManifestPage />);
    const fileInput = screen.getByTestId(TEST_ID.FILE_UPLOAD_FIELD);
    const subKeyTextField = screen.getByTestId(TEST_ID.SUBSCRIPTION_KEY_FIELD);

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(screen.getByTestId(TEST_ID.FILE_NAME_FIELD).textContent).toBe(file.name);
    expect(screen.queryByText('error.file.size.exceeded')).toBeNull();
    expect(screen.queryByText('error.file.type.incorrect')).toBeNull();

    fireEvent.change(subKeyTextField, {
      target: {
        value: 'Sonic the Hedgehog isnt his fullname',
      },
    });

    const uploadButton = screen.getByTestId(TEST_ID.UPLOAD_BUTTON);
    fireEvent.click(uploadButton);

    expect(uploadFileSpy).toBeCalledWith(file);
  });

  it('should show an error when the file is too big', async () => {
    render(<CreateManifestPage />);
    const fileInput = screen.getByTestId(TEST_ID.FILE_UPLOAD_FIELD);
    file.size = 1024 * 1024 * 101;

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await flushPromises();

    expect(screen.getByText('error.file.size.exceeded')).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_ID.FILE_NAME_FIELD)).toBeNull();
  });

  it('should show an error when the file is not zip', async () => {
    render(<CreateManifestPage />);
    const fileInput = screen.getByTestId(TEST_ID.FILE_UPLOAD_FIELD);
    file.type = 'application/jpg';

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await flushPromises();

    expect(screen.getByText('error.file.type.incorrect')).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_ID.FILE_NAME_FIELD)).toBeNull();
  });

  it('should pick different geographies', async () => {
    render(<CreateManifestPage />);

    // Wait for the translated geography options to be rendered
    expect(screen.getByText('geography.unitedstates')).toBeInTheDocument();
    // Click on the dropdown (geography.unitedstates is pre-selected)
    fireEvent.click(screen.getByText('geography.unitedstates'));
    // Dropdown should have options, one for each geography
    fireEvent.click(screen.getByText('geography.europe'));
  });

  it('should show error when subKey contains invalid chars', async () => {
    const view = render(<CreateManifestPage />);
    const subKeyTextField = screen.getByTestId(TEST_ID.SUBSCRIPTION_KEY_FIELD);

    fireEvent.change(subKeyTextField, {
      target: {
        value: 'subscription_key!',
      },
    });

    await flushPromises();
    expect(view).toMatchSnapshot();
  });
});
