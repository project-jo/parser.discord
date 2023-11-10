import { pathToFileURL } from "url";
import { resolve } from "path";
import { readdir } from "fs/promises";
import { readFileSync, statSync } from "fs";

const globalFilePath = (path: string) => pathToFileURL(path)?.href || path;

function formatFileSize(size: number): string {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}

export async function readFiles(path: string) {
  let files: any[] = [];
  const items = await readdir(path, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await readFiles(`${path}/${item.name}`))];
    } else if (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.cjs'))) {
      files.push(`${path}/${item.name}`);
    }
  }
  return files;
}

export async function find(path: string) {
  const command = await import(globalFilePath(resolve(path))).then(x => x.default).catch(() => { });
  return command;
}

export function checkFileSize(path: string) {
  const stats = statSync(path);
  const data = readFileSync(path, 'utf-8');

  const lines = data.split('\n');
  const totalLines = lines.length;

  const fileSizeInBytes = stats.size;

  const fileSize = formatFileSize(fileSizeInBytes);

  return {
    total_line: totalLines,
    file_size: fileSize
  }
}
