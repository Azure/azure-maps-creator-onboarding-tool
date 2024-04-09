import { DefaultButton, Icon, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';
import * as React from 'react';
import { bold, buttonStyle, dialogStyle, exampleFileContentStyle, infoButtonStyle, list } from './index.style';

const ActionDialog = () => {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <DefaultButton className={infoButtonStyle}>
          <Icon aria-label="Tooltip" iconName="Info" />
        </DefaultButton>
      </DialogTrigger>
      <DialogSurface className={dialogStyle}>
        <DialogBody>
          <DialogTitle>CSV file requirements</DialogTitle>
          <DialogContent>
            <div>
              <div>
                <MessageBar messageBarType={MessageBarType.info}>
                  To ensure your CSV file is compatible, please adhere to the following format and rules
                </MessageBar>
                <p>
                  <span className={bold}>Format:</span> The CSV file should map IMDF categories to labels found in the
                  drawing file using key-value pairs.
                </p>
                <ul className={list}>
                  <li>
                    The <span className={bold}>first column</span> (key) is the label found in the drawing file.
                  </li>
                  <li>
                    The <span className={bold}>second column</span> (value) is the IMDF category. During processing, any
                    label (key) matching this will be replaced with the corresponding IMDF category.
                  </li>
                </ul>
                <p>
                  <span className={bold}>Rules:</span>
                </p>
                <ul className={list}>
                  <li>
                    <span className={bold}>No Header Row:</span> The CSV file should not contain a header row.
                  </li>
                  <li>
                    <span className={bold}>Two Columns Only:</span> Each row must consist of exactly 2 columns.
                  </li>
                  <li>
                    <span className={bold}>Unique Keys:</span> Ensure there are no duplicate keys.
                  </li>
                  <li>
                    <span className={bold}>Valid IMDF Categories:</span> The value must be a recognized{' '}
                    <a
                      href="https://register.apple.com/resources/imdf/reference/categories#unit"
                      target="_blank"
                      rel="noreferrer"
                    >
                      IMDF category
                    </a>
                    .
                  </li>
                </ul>
                <p>
                  <span className={bold}>Example File Content:</span>
                </p>
              </div>
              <div className={exampleFileContentStyle}>
                <div>Copy/Print,mailroom</div>
                <div>Circulation (Primary),walkway</div>
                <div>Circulation (Secondary),walkway</div>
                <div>Elevator,elevator</div>
                <div>Focus Room,room</div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <PrimaryButton className={buttonStyle} appearance="primary">
                Close
              </PrimaryButton>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ActionDialog;
