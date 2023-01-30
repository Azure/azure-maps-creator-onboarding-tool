const madge = require('madge');

madge('src/index.js').then((res) => {
  const circularDeps = res.circularGraph();

  if (Object.keys(circularDeps).length === 0) {
    console.log('No circular dependencies detected.');
  } else {
    console.log('Detected circular dependencies:');
    console.log(circularDeps);
  }
});