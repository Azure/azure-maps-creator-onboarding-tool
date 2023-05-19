import * as zip from '@zip.js/zip.js';

export async function createPackageWithJson(originalPackage, json) {
  const zipFileReader = new zip.BlobReader(originalPackage);
  const zipReader = new zip.ZipReader(zipFileReader);

  const newFile = new Blob([JSON.stringify(json, null, 2)], {
    type: 'application/json',
  });

  const blobWriter = new zip.BlobWriter('application/zip');
  const writer = new zip.ZipWriter(blobWriter);

  await writer.add('manifest.json', new zip.BlobReader(newFile));

  const entries = await zipReader.getEntries();

  for (let i = 0; i < entries.length; i++) {
    const file = entries[i];
    if (file.filename.endsWith('.dwg')) {
      const data = await file.getData(new zip.BlobWriter());
      await writer.add(file.filename, new zip.BlobReader(data));
    }
  }

  return await writer.close();
}