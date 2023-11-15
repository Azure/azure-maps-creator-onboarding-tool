const { defineConfig } = require('cypress');
const zip = require('@zip.js/zip.js');

module.exports = defineConfig({
  defaultCommandTimeout: 10000,

  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async validateManifestFromZip({ drawingPackage, expectedManifest }) {
          const zipFileReader = new zip.Data64URIReader(drawingPackage);
          const zipReader = new zip.ZipReader(zipFileReader);
          let downloadedManifest = {};
          const entries = await zipReader.getEntries();

          for (let i = 0; i < entries.length; i++) {
            const file = entries[i];
            if (file.filename.toLowerCase() === 'manifest.json') {
              const data = await file.getData(new zip.BlobWriter());
              downloadedManifest = JSON.parse(await data.text());
            }
          }
          if (JSON.stringify(downloadedManifest) !== JSON.stringify(expectedManifest)) {
            throw new Error(
              JSON.stringify({
                error: 'Manifest does not match.',
                downloadedManifest,
                expectedManifest,
              })
            );
          }

          return null;
        },
      });
    },
  },
});
