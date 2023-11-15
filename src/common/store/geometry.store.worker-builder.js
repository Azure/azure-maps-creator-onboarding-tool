// this was extracted to a separate file purely to make testing easier
// jest was failing with error 'Cannot use 'import.meta' outside a module'
// which normally should be fixed by tweaking webpack/babel configs
// but cause we're using create-react-app these configs are hidden and cannot be easily modified
// to do that we need either to eject CRA or use npm packages like https://www.npmjs.com/package/react-app-rewired to extend it
// anyway, I thought it'd be easier just to move this to a separate file and then mock it globally in setupTests.js
const buildWorker = () => new Worker(new URL('./geometry.store.worker', import.meta.url));
export default buildWorker;
