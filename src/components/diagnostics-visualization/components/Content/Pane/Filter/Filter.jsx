import { Sticky } from '@fluentui/react/lib/Sticky';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { FilterBar } from 'azure-devops-ui/FilterBar';
import { KeywordFilterBarItem } from 'azure-devops-ui/TextFilterBarItem';
import { DropdownMultiSelection, DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { Filter as DevopsFilter } from 'azure-devops-ui/Utilities/Filter';
import * as React from 'react';

class Filter extends React.Component {
  filter = new DevopsFilter();

  filterInput = '';

  selectionCode = new DropdownMultiSelection();

  selectionOrdinal = new DropdownSelection();

  selectionLayer = new DropdownMultiSelection();

  codeOptions;

  nxtResultItems;

  ordinalOptions;

  layerOptions;

  constructor(props) {
    super(props);

    this.filter.subscribe(this.onChange);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { resultItems } = this.props;
    const { resultItems: nxtResultItems } = nextProps;

    if (nextState !== this.state) {
      return true;
    }
    if (resultItems === nxtResultItems) {
      return false;
    }
    this.nxtResultItems = nxtResultItems;

    // Configure filter options
    const { errors: nxtErrors, levelOutlines: nxtLevelOutlines } = nxtResultItems;

    const uniqueCodes = [...new Set((nxtErrors || []).map(error => error.code))].sort();
    /*  Merge error & levelOutline levelOrdinals,
        Convert to a Set to clear duplicates,
        Convert back to an array,
        Sort the array
    */
    const uniqueOrdinals = [
      ...new Set([
        ...(nxtErrors || []).map(error => error.levelOrdinal),
        ...(nxtLevelOutlines || []).map(levelOutline => levelOutline.levelOrdinal),
      ]),
    ].sort(this.genericCompare);
    const uniqueLayers = [...new Set((nxtErrors || []).map(error => error.layerName))].sort();

    this.codeOptions = uniqueCodes.map(code => ({ id: String(code), text: String(code) }));
    this.ordinalOptions = uniqueOrdinals.map(ordinal => ({ id: String(ordinal), text: String(ordinal) }));
    this.layerOptions = uniqueLayers.map(layer => ({ id: String(layer), text: String(layer) }));

    // Edge case
    // Handle filters on initial base ordinal selection
    let firstNonNegativeOrdinalOrZero = uniqueOrdinals.findIndex(ordinal => ordinal > -1);
    if (firstNonNegativeOrdinalOrZero < 0) {
      firstNonNegativeOrdinalOrZero = 0;
    }
    this.selectionOrdinal.select(firstNonNegativeOrdinalOrZero);
    if (uniqueOrdinals.length === 0) {
      this.selectionOrdinal.clear();
    }
    if (this.selectionOrdinal.selected(firstNonNegativeOrdinalOrZero)) {
      const baseOrdinal = String(uniqueOrdinals[firstNonNegativeOrdinalOrZero]);
      const prevOrdinalFilterStates = this.filter.getFilterItemState('ordinal') || { value: [baseOrdinal] };
      this.filter.setFilterItemState('ordinal', { value: [...prevOrdinalFilterStates.value, baseOrdinal] });
    }

    return true;
  };

  render = () => {
    const { resultItems } = this.props;
    if (!resultItems) {
      return null;
    }
    return (
      <Sticky stickyBackgroundColor="white">
        <FilterBar className="pane-filter" filter={this.filter}>
          <KeywordFilterBarItem filterItemKey="keyword" />
          <DropdownFilterBarItem
            filterItemKey="code"
            items={this.codeOptions}
            noItemsText="No codes found"
            placeholder="Code"
            selection={this.selectionCode}
            showFilterBox
          />
          <DropdownFilterBarItem
            filterItemKey="ordinal"
            hideClearAction
            items={this.ordinalOptions}
            noItemsText="No levels found"
            placeholder="Level"
            selection={this.selectionOrdinal}
            showFilterBox
          />
          <DropdownFilterBarItem
            filter={this.filter}
            filterItemKey="layer"
            items={this.layerOptions}
            noItemsText="No layers found"
            placeholder="Layer"
            selection={this.selectionLayer}
            showFilterBox
          />
        </FilterBar>
      </Sticky>
    );
  };

  componentWillUnmount = () => {
    this.filter.unsubscribe(this.filterSubscribe);
  };

  onChange = () => {
    const resultItems = this.nxtResultItems;
    if (!resultItems) {
      return;
    }

    const { keyword, code, ordinal, layer } = this.filter.getState();
    if (!layer) {
      this.selectionLayer.clearSelectedRanges();
    } // Bug on DevOps, but can't seem to find a place to file the bug

    // Retrieve excluded IDs
    const codeSet = code ? new Set(code.value) : undefined;
    const ordinalSet = ordinal ? new Set(ordinal.value) : undefined;
    const layerSet = layer ? new Set(layer.value) : undefined;
    const filterKeyword = keyword && keyword.value && keyword.value.toLowerCase();

    const { errors, levelOutlines } = resultItems;
    const errorsExcludedIds = (errors || [])
      .filter(
        error =>
          (codeSet && codeSet.size !== 0 && !codeSet.has(error.code)) ||
          (ordinalSet && ordinalSet.size !== 0 && !ordinalSet.has(String(error.levelOrdinal))) ||
          (layerSet && layerSet.size !== 0 && !layerSet.has(error.layerName)) ||
          (filterKeyword &&
            (!error.code || error.code.toLowerCase().indexOf(filterKeyword) === -1) &&
            (!error.message || error.message.toLowerCase().indexOf(filterKeyword) === -1) &&
            (!error.layerName || error.layerName.toLowerCase().indexOf(filterKeyword) === -1) &&
            (!error.geometry || error.geometry.toLowerCase().indexOf(filterKeyword) === -1) &&
            String(error.levelOrdinal || '')
              .toLowerCase()
              .indexOf(filterKeyword) === -1)
      )
      .map(error => error.key);
    const levelOutlinesExcludedIds = (levelOutlines || [])
      .filter(
        levelOutline =>
          (ordinalSet && ordinalSet.size !== 0 && !ordinalSet.has(String(levelOutline.levelOrdinal))) ||
          (filterKeyword &&
            String(levelOutline.levelOrdinal || '')
              .toLowerCase()
              .indexOf(filterKeyword) === -1)
      )
      .map(levelOutline => levelOutline.key);

    this.props.setExcludedIds({
      errors: new Set(errorsExcludedIds),
      levelOutlines: new Set(levelOutlinesExcludedIds),
    });
  };

  /**
   * Used for sorting arrays.
   * Numbers are sorted, then objects by a - b.
   * Example: Array(11) [ "1", 1, "2", 2, 3, "153", "dpoaj", NaN, {}, {…}, undefined ]
   */
  genericCompare = (a, b) => {
    if (Number.isNaN(a) && Number.isNaN(b)) {
      if (typeof a === 'string' && b === 'string') {
        return a.localeCompare(b);
      }
      return a - b;
    }

    if (Number.isNaN(a)) {
      return 1;
    }
    if (Number.isNaN(b)) {
      return -1;
    }
    return a - b;
  };
}

export default Filter;
