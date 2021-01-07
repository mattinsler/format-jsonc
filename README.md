# @mattinsler/format-jsonc

Consistent formatting for JSONC files

## Example

```typescript
import { format, parseFileSync } from '@mattinsler/format-jsonc';

// read a json file and parse it
const ast = parseFileSync('./tsconfig.json');
// format back to JSONC
format(ast);

// sort all objects and then format to JSONC
format(ast, [sortObjects()]);

// only sort the array named "sort-me"
format(ast, [sortArrays((path) => isObjectPropertyNamed('sort-me'))]);
```

## API

Parsing

- **parse(text: string): ASTObject**
- **parseFile(filename: string): Promise<ASTObject>**
- **parseFileSync(filename: string): ASTObject**

Formatting

- **format(ast: ASTArray | ASTObject): string**
- **format(ast: ASTArray | ASTObject, transforms: Transform[]): string**

Transforming

- **sortArrays(): Transform**
- **sortArrays(predicate: Predicate<ASTArray>): Transform**
- **sortObjects(): Transform**
- **sortObjects(predicate: Predicate<ASTObject>): Transform**
