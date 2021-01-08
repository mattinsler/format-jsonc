import { fixtures } from './fixtures';
import { format, parse, sortArrays, sortObjects } from '../src';

describe('clone', () => {
  it('ensures that format transforms do not impact the ast by cloning first', () => {
    const ast = parse(fixtures.original);
    expect(format(ast, [sortArrays(), sortObjects()])).toEqual(fixtures.formatSorted);
    expect(format(ast)).toEqual(fixtures.format);
  });
});
