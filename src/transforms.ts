import { traverse } from './traverse';
import { ASTArray, ASTNode, ASTObject, Path, Visitor } from './types';
import { isBoolean, isNumber, isObjectProperty, isString } from './tools';

export type Transform = Visitor;
export type Predicate<N extends ASTNode> = (path: Path<N>) => boolean;
const TruePredicate = () => true;

export function applyTransforms(ast: ASTNode, transforms: Transform[]) {
  transforms.forEach((transform) => traverse(ast, transform));
}

const ORDER_OF_TYPES: ASTNode['type'][] = ['Null', 'Boolean', 'Number', 'String', 'Array', 'Object'];
const TYPE_ORDERING = new Map(ORDER_OF_TYPES.map((type, idx) => [type, idx]));

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
            if (isBoolean(l) && isBoolean(r)) {
              return Number(l.value) - Number(r.value);
            }
            return TYPE_ORDERING.get(l.type)! - TYPE_ORDERING.get(r.type)!;
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
