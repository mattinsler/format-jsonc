import fs from 'fs';
import path from 'path';

export const fixtures = {
  commentsOriginal: fs.readFileSync(path.join(__dirname, 'comments-original.json'), 'utf-8'),
  commentsFormatted: fs.readFileSync(path.join(__dirname, 'comments-formatted.json'), 'utf-8'),
  original: fs.readFileSync(path.join(__dirname, 'original.json'), 'utf-8'),
  format: fs.readFileSync(path.join(__dirname, 'format.json'), 'utf-8'),
  formatSorted: fs.readFileSync(path.join(__dirname, 'format-sorted.json'), 'utf-8'),
};
