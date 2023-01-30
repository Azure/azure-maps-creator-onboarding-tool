/**
 * Given a single path name, returns a list of all path names from root to the given path name.
 * Ex. Given '/create/hello', returns ['/', '/create', '/create/hello']
 * @param {String} pathName the path name of the URL
 * @returns {String[]} an array of path names
 */
export const getSplitPaths = (pathName) => {
  if (typeof pathName !== 'string' || pathName === '') { return []; }
  if (pathName === '/') { return ['/']; }

  const pathNameLowerCase = pathName.toLowerCase();
  const splits = pathNameLowerCase.split('/');
  const splitPaths = [];
  for (let i = splits.length - 1; i > 0; i--) {
    let stringBuilder = '';
    for (let j = 1; j <= i; j++) {
      stringBuilder += '/' + splits[j];
    }
    splitPaths.push(stringBuilder);
  }
  splitPaths.push('/');
  splitPaths.reverse();

  return splitPaths;
};