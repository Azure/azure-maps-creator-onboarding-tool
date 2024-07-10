/* eslint-disable no-nested-ternary */
import * as React from 'react';
import FileUploaderStyle from '../../../../../styles/FileUploader';
import { parseDiagnosticData } from './helpers';

class FileUploader extends React.Component {
  errorInsertIndex = 0;

  prevItems = [];

  constructor(props) {
    super(props);

    this.state = {
      showError: undefined,
    };
  }

  render = () => (
    <>
      <FileUploaderStyle
        iconName="OpenFile"
        texts={{
          header: 'No data loaded',
          content: 'Upload the ConversionWarningsAndErrors.json file to visualize bugs',
          button: 'Drag & drop or click here to add a file',
        }}
        props={{
          button: { onClick: this.onUploadClick },
          dropzone: {
            accept: 'application/json',
            multiple: false,
            onDrop: this.onDrop,
            onDropRejected: this.onDropRejected,
          },
        }}
      />
    </>
  );

  onDrop = acceptedFiles => {
    if (acceptedFiles.length !== 1) {
      return;
    }
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onabort = () => this.setState({ showError: 'File reading was aborted.' });
    reader.onerror = () => this.setState({ showError: 'File reading has failed.' });
    reader.onload = () => {
      const binaryStr = reader.result;

      let jsonContent;
      try {
        jsonContent = JSON.parse(binaryStr);
      } catch (e) {
        if (e instanceof SyntaxError) {
          this.setState({
            showError: 'An invalid JSON file was provided.',
          });
        } else {
          this.setState({
            showError: "We've encountered an unexpected error.",
          });
        }
      }

      if (!jsonContent) {
        return;
      }
      this.processJsonContent(jsonContent);
    };

    reader.readAsText(file);
  };

  onDropRejected = file => {
    if (file.length !== 1) {
      this.setState({
        showError: 'Please upload one file.',
      });
      return;
    }

    const { name } = file[0];
    this.setState({
      showError: `File ${name} was rejected. Make sure it is a valid .json file.`,
    });
  };

  processJsonContent = data => {
    const parsedData = parseDiagnosticData(data);

    const { parseError, items } = parsedData;
    if (parseError) {
      this.setState({
        showError: parseError,
      });
      return;
    }

    this.props.setResultItems(items);
  };

  parseDetail = rawDetail => {
    const { code, message, innererror } = rawDetail;
    const layerName = innererror ? (innererror.layerName ? String(innererror.layerName) : 'undefined') : 'undefined';
    const levelOrdinal = innererror
      ? !Number.isNaN(Number(innererror.levelOrdinal))
        ? Number(innererror.levelOrdinal)
        : 'NaN'
      : 'NaN';

    return {
      // eslint-disable-next-line no-plusplus
      key: this.errorInsertIndex++,
      code,
      layerName,
      levelOrdinal,
      message,
      rawDetail,
      ...(innererror && { geometry: innererror.geometry }),
    };
  };
}

export default FileUploader;
