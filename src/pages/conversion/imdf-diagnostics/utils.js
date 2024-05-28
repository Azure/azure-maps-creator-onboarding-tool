import * as zip from '@zip.js/zip.js';

export async function fetchZip(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  const blob = await response.blob(); // Get a Blob from the response
  return blob;
}

export async function unzipBlob(blob) {
  const reader = new zip.ZipReader(new zip.BlobReader(blob));
  const entries = await reader.getEntries(); // Get all ZIP entries (files)
  if (entries.length === 0) {
    throw new Error('The ZIP file is empty');
  }
  return entries;
}

async function readJsonEntries(entries) {
  const files = await Promise.all(
    entries
      .map(async entry => {
        if (!entry.directory) {
          const content = await entry.getData(new zip.TextWriter(), {
            onprogress: (progress, total) => {},
          });
          let json = null;
          try {
            json = JSON.parse(content);
          } catch {}
          return { filename: entry.filename, content: json };
        }
        return null;
      })
      .filter(entry => entry.content !== null)
  );

  return files.filter(Boolean); // Filter out null values (directories)
}

export async function processZip(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const blob = await fetchZip(url);
      const entries = await unzipBlob(blob);
      const files = await readJsonEntries(entries);

      resolve(files);
    } catch (error) {
      console.error('Error processing ZIP file:', error);
      reject(error);
    }
  });
}

export function extractMessages(obj) {
  let groupedMessages = {
    other: [],
    errors: [],
    warnings: [],
  };

  function traverse(current, context) {
    if (typeof current === 'object' && current !== null) {
      if (Array.isArray(current)) {
        current.forEach(element => traverse(element, context));
      } else {
        for (const key in current) {
          if (key === 'message') {
            if (context === 'error') {
              groupedMessages.errors.push(current[key]);
            } else if (context === 'warning') {
              groupedMessages.warnings.push(current[key]);
            } else {
              groupedMessages.other.push(current[key]);
            }
          } else {
            let newContext = context;
            if (key === 'error') newContext = 'error';
            else if (key === 'warning') newContext = 'warning';

            traverse(current[key], newContext);
          }
        }
      }
    }
  }

  traverse(obj, 'other');
  return groupedMessages;
}
