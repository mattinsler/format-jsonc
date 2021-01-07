import { traverse } from './traverse';
import { isNumber, isObjectProperty, isString } from './tools';
import { ASTArray, ASTNode, ASTObject, Path, Visitor } from './types';

export type Transform = Visitor;
export type Predicate<N extends ASTNode> = (path: Path<N>) => boolean;
const TruePredicate = () => true;

export function applyTransforms(ast: ASTNode, transforms: Transform[]) {
  transforms.forEach((transform) => traverse(ast, transform));
}

export function sortArrays(predicate: Predicate<ASTArray> = TruePredicate): Transform {
  return {
    Array: {
      exit(path) {
        if (predicate(path)) {
          path.node.items.sort((l, r) => {
            if (isString(l) && isString(r)) {
              return l.value.localeCompare(r.value);
            }
            if (isNumber(l) && isNumber(r)) {
              return l.value - r.value;
            }
            return 0;
          });
        }
      },
    },
  };
}

export function sortObjects(predicate: Predicate<ASTObject> = TruePredicate): Transform {
  return {
    Object: {
      exit(path) {
        if (predicate(path)) {
          path.node.properties.sort((l, r) => l.key.localeCompare(r.key));
        }
      },
    },
  };
}

export const unless = <N extends ASTNode>(predicate: Predicate<N>): Predicate<N> => (path) => !predicate(path);
export const isObjectPropertyNamed = (...key: string[]): Predicate<ASTNode> => (path) =>
  Boolean(path.parent && isObjectProperty(path.parent) && key.indexOf(path.parent.node.key) !== -1);
