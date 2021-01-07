import { format, parse, sortArrays, sortObjects } from '../src';

const JSON = `

{
  "c": 123,
  "d": [4, 3, 
    // comment on "d.1"
    1, 2],
  // comment on "b"
  "b": false,
  "a": "123"
}
`;

const FORMATTED_JSON = `{
  "c": 123,

  "d": [
    4,
    3,
    // comment on "d.1"
    1,
    2,
  ],

  // comment on "b"
  "b": false,

  "a": "123",
}`;

const FORMATTED_TRANSFORMED_JSON = `{
  "a": "123",

  // comment on "b"
  "b": false,

  "c": 123,

  "d": [
    // comment on "d.1"
    1,
    2,
    3,
    4,
  ],
}`;

describe('format-jsonc', () => {
  it('formats', () => {
    const ast = parse(JSON);
    expect(format(ast)).toEqual(FORMATTED_JSON);
  });

  it('formats with transforms', () => {
    const ast = parse(JSON);
    expect(format(ast, [sortArrays(), sortObjects()])).toEqual(FORMATTED_TRANSFORMED_JSON);
  });
});
