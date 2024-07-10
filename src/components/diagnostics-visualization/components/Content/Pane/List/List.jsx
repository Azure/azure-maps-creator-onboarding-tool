/* eslint-disable no-param-reassign */
import { Announced } from '@fluentui/react/lib/Announced';
import { ColumnActionsMode, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { ScrollToMode } from '@fluentui/react/lib/List';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import * as React from 'react';
import { areItemKeysEqual, copyAndSort } from './ListHelpers';
import { DetailedViewLink, RenderDetailsHeader } from './ListSupportRenders';

class List extends React.Component {
  prevItems = [];

  constructor() {
    super();
    this.state = {
      announcedMessage: undefined,
      columns: [
        {
          key: 'codeColumn',
          maxWidth: 100,
          minWidth: 40,
          name: 'Code',
          fieldName: 'code',
          isResizable: true,
          onColumnClick: this.onColumnClick,
        },
        {
          key: 'messageColumn',
          maxWidth: 290,
          minWidth: 150,
          name: 'Message',
          fieldName: 'message',
          isResizable: true,
          onColumnClick: this.onColumnClick,
        },
        {
          key: 'ordinalColumn',
          maxWidth: 40,
          minWidth: 40,
          name: 'Level',
          fieldName: 'levelOrdinal',
          isResizable: true,
          onColumnClick: this.onColumnClick,
        },
        {
          key: 'layerColumn',
          minWidth: 100,
          name: 'Layer',
          fieldName: 'layerName',
          isResizable: true,
          onColumnClick: this.onColumnClick,
        },
        {
          key: 'iconsColumn',
          fieldName: 'iconsName',
          columnActionsMode: ColumnActionsMode.disabled,
          isIconOnly: true,
          onRender: item => <DetailedViewLink onClick={() => this.onLinkClick(item)} />,
        },
      ],
      items: [],
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { excludedErrorIds, errors } = this.props;
    const { excludedErrorIds: nxtExcludedErrorIds, errors: nxtErrors } = nextProps;

    if (!errors && !nxtErrors) {
      return false;
    }
    if (this.state !== nextState) {
      return true;
    }
    if (errors === nxtErrors && excludedErrorIds === nxtExcludedErrorIds) {
      return false;
    }

    // Reset column sorted state on excluded set change
    const { columns } = this.state;
    if (columns) {
      columns.forEach(column => {
        column.isSorted = false;
      });
    }

    return true;
  };

  componentDidUpdate() {
    const { excludedErrorIds, errors } = this.props;
    if (!excludedErrorIds || !errors) {
      return;
    }

    const items = [];
    errors.forEach(item => {
      if (excludedErrorIds.has(item.key)) {
        return;
      }
      items.push(item);
    });

    if (!areItemKeysEqual(this.prevItems, items)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        items,
      });
    }

    this.prevItems = items;
  }

  render = () => {
    const { announcedMessage, columns, items } = this.state;
    const { errors, selection } = this.props;

    // if errors === undefined: Data haven't been loaded
    // if errors instanceof array: Data have been loaded

    return (
      <>
        {announcedMessage ? <Announced message={announcedMessage} /> : undefined}

        {errors && (
          <ShimmeredDetailsList
            compact
            enableShimmer={!errors}
            items={items}
            columns={columns}
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            ariaLabelForSelectionColumn="Toggle selection"
            checkButtonAriaLabel="Row checkbox"
            selection={selection}
            selectionMode={SelectionMode.multiple}
            ScrollToMode={ScrollToMode.auto}
            onActiveItemChanged={this.onActiveItemChanged}
            onRenderDetailsHeader={RenderDetailsHeader}
          />
        )}
      </>
    );
  };

  onColumnClick = (_, column) => {
    if (!column) {
      // This should not happen
      throw new Error('Column was not returned from the event handler.');
    }

    const { columns, items } = this.state;
    const newColumns = columns.slice();
    const currColumn = newColumns.filter(currCol => column.key === currCol.key)[0];

    newColumns.forEach(newCol => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        this.setState({
          announcedMessage: `${currColumn.name} is sorted ${
            currColumn.isSortedDescending ? 'descending' : 'ascending'
          }`,
        });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });

    const newItems = copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  };

  onActiveItemChanged = item => this.props.onActiveItemChanged(item);

  onLinkClick = item => this.props.onDetailsClick(item);
}

export default List;
