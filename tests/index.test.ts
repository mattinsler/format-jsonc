import { fixtures } from './fixtures';
import { format, parse, sortArrays, sortObjects } from '../src';

describe('format-jsonc', () => {
  it('formats', () => {
    const ast = parse(fixtures.original);
    expect(format(ast)).toEqual(fixtures.format);
  });

  it('formats with transforms', () => {
    const ast = parse(fixtures.original);
    expect(format(ast, [sortArrays(), sortObjects()])).toEqual(fixtures.formatSorted);
  });
});
