import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import flushPromises from 'flush-promises';

import CreateManifestPage, { TEST_ID } from './create-manifest';
import { uploadFile } from 'common/api';
import { useResponseStore } from 'common/store';

const mockNavigate = jest.fn();
const mockSetOriginalPackage = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock('common/api', () => ({
  ...jest.requireActual('common/api'),
  uploadFile: jest.fn(),
}));
jest.mock('common/store/review-manifest.store', () => ({
  useReviewManifestStore: () => mockSetOriginalPackage,
}));

describe('CreateManifestPage', () => {
  let file;
  let manifestJsonFile;
  const state = useResponseStore.getState();
  const uploadFileSpy = jest.spyOn(state, 'uploadFile');
  const setExistingManifestJsonSpy = jest.spyOn(state, 'setExistingManifestJson');

  beforeEach(() => {
    uploadFile.mockReturnValue(Promise.resolve({}));
    file = {
      name: 'my zip archive.zip',
      size: 1024 * 1024 * 10,
      type: 'application/x-zip-compressed',
    };
    manifestJsonFile = new File(['{"foo":"bar"}'], 'manifest.json', {
      type: 'application/json',
      lastModified: Date.now(),
    });
    useResponseStore.setState({
      errorMessage: 'some err',
    });
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const view = render(<CreateManifestPage />);
    expect(view).toMatchSnapshot();
  });

  it('should render correctly with allowEdit prop', () => {
    const view = render(<CreateManifestPage allowEdit />);
    expect(view).toMatchSnapshot();
  });

  it('should upload file correctly', () => {
    expect(uploadFileSpy).not.toHaveBeenCalled();
    expect(mockSetOriginalPackage).not.toHaveBeenCalled();
    expect(setExistingManifestJsonSpy).not.toHaveBeenCalled();
    render(<CreateManifestPage />);
    const fileInput = screen.getByTestId(TEST_ID.FILE_UPLOAD_FIELD);
    const uploadButton = screen.getByTestId(TEST_ID.UPLOAD_BUTTON);
    const subKeyTextField = screen.getByTestId(TEST_ID.SUBSCRIPTION_KEY_FIELD);

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(screen.getAllByTestId(TEST_ID.FILE_NAME_FIELD)[0].value).toBe(file.name);
    expect(screen.queryByText('error.file.size.exceeded')).toBeNull();
    expect(screen.queryByText('error.file.type.incorrect')).toBeNull();

    fireEvent.change(subKeyTextField, {
      target: {
        value: 'Sonic the Hedgehog isnt his fullname',
      },
    });
    fireEvent.click(uploadButton);

    expect(uploadFileSpy).toBeCalledWith(file);
    expect(setExistingManifestJsonSpy).toBeCalledWith(null);
    expect(mockSetOriginalPackage).toHaveBeenCalledWith(file);
  });

  it('should upload file correctly with allowEdit true', async () => {
    expect(uploadFileSpy).not.toHaveBeenCalled();
    expect(mockSetOriginalPackage).not.toHaveBeenCalled();
    expect(setExistingManifestJsonSpy).not.toHaveBeenCalled();
    render(<CreateManifestPage allowEdit />);
    const fileInput = screen.getByTestId(TEST_ID.FILE_UPLOAD_FIELD);
    const manifestJsonInput = screen.getByTestId(TEST_ID.MANIFEST_UPLOAD_FIELD);
    const uploadButton = screen.getByTestId(TEST_ID.UPLOAD_BUTTON);
    const subKeyTextField = screen.getByTestId(TEST_ID.SUBSCRIPTION_KEY_FIELD);

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });
    fireEvent.change(manifestJsonInput, {
      target: { files: [manifestJsonFile] },
    });

    expect(screen.getAllByTestId(TEST_ID.FILE_NAME_FIELD)[0].value).toBe(file.name);
    expect(screen.getAllByTestId(TEST_ID.FILE_NAME_FIELD)[1].value).toBe(manifestJsonFile.name);
    expect(screen.queryByText('error.file.size.exceeded')).toBeNull();
    expect(screen.queryByText('error.file.type.incorrect')).toBeNull();

    fireEvent.change(subKeyTextField, {
      target: {
        value: 'Sonic the Hedgehog isnt his fullname',
      },
    });

    await waitFor(() => expect(uploadButton).not.toBeDisabled());

    fireEvent.click(uploadButton);

    expect(uploadFileSpy).toBeCalledWith(file);
    expect(setExistingManifestJsonSpy).toBeCalledWith({ foo: 'bar' });
    expect(mockSetOriginalPackage).toHaveBeenCalledWith(file);
  });

  it('should show an error when the file is too big',  async () => {
    render(<CreateManifestPage />);
    const fileInput = screen.getByTestId(TEST_ID.FILE_UPLOAD_FIELD);
    file.size = 1024 * 1024 * 101;

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await flushPromises();

    expect(screen.getByText('error.file.size.exceeded')).toBeInTheDocument();
    expect(screen.getAllByTestId(TEST_ID.FILE_NAME_FIELD)[0].value).toBe('');
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
    expect(screen.getAllByTestId(TEST_ID.FILE_NAME_FIELD)[0].value).toBe('');
  });

  it('should redirect to home page when Cancel button is clicked', () => {
    render(<CreateManifestPage />);
    const cancelButton = screen.getByTestId(TEST_ID.CANCEL_BUTTON);
    fireEvent.click(cancelButton);
    expect(mockNavigate).toBeCalledWith('/');
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