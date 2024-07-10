export const areItemKeysEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i].key !== b[i].key) {
      return false;
    }
  }
  return true;
};

export const copyAndSort = (items, key, isSortedDescending) => items
  .slice(0)
  .sort((a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
