All geometry-related calculations happen in two files:
- geometry.store.js
- geometry.store.worker.js

`useDissolvedExterior` hook of `geometry.store.js` is the main entry point and is used to retrieve dissolved geometries from the store.

The calculation is a heavy process and is hidden away from the store into the worker to prevent impact on FPS rendering and keep UX smooth.

`geometry.store.worker.js` contains
- worker methods
- dissolving/merging methods, using turf.js
- functions copied from https://github.com/proj4js. Initially we used proj4 directly but it's been too slow,
copying it over and removing unused code speeded it up.

Overall the process of calculating merged geometry includes these steps:
- select chosen layers from the store(`filteredPolygonLayers`)
- split selected geometries by type polygon/multipolygon (`geometriesByType`). Also during this step we convert meters coordinates to degrees
- combine polygons into a single multipolygon using `combine` method of turf.js
- union all multipolygons (those filtered by split and one added by combining polygons) to get a single geometry
- add rotation as needed