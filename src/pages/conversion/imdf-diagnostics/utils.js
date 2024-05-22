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
  let messages = [];

  // Recursive function to traverse the object
  function traverse(current) {
    // Check if current is an object or array
    if (typeof current === 'object' && current !== null) {
      // If it's an array, iterate through its elements
      if (Array.isArray(current)) {
        for (const element of current) {
          traverse(element);
        }
      } else {
        // If it's an object, check for 'message' field and recurse for each property
        for (const key in current) {
          if (key === 'message') {
            messages.push(current[key]);
          } else {
            traverse(current[key]);
          }
        }
      }
    }
  }

  traverse(obj);
  return messages;
}
