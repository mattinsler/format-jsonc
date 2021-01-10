import { fixtures } from './fixtures';
import { format, parse } from '../src';

describe('format-jsonc', () => {
  it('formats comments', () => {
    const ast = parse(fixtures.commentsOriginal);
    expect(format(ast)).toEqual(fixtures.commentsFormatted);
  });
});
