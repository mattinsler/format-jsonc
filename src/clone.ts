import {
  ASTArray,
  ASTBoolean,
  ASTComments,
  ASTNull,
  ASTNumber,
  ASTObject,
  ASTObjectProperty,
  ASTString,
} from './types';
import { isArray, isBoolean, isNull, isNumber, isObject, isObjectProperty, isString } from './tools';

const cloneComments = (ast: ASTComments): ASTComments => ({
  leading: ast.leading.map((c) => ({ ...c })),
  trailing: ast.trailing.map((c) => ({ ...c })),
});

const cloneArray = (ast: ASTArray): ASTArray => ({
  comments: cloneComments(ast.comments),
  items: ast.items.map(clone),
  path: [...ast.path],
  type: ast.type,
});

const cloneObject = (ast: ASTObject): ASTObject => ({
  comments: cloneComments(ast.comments),
  path: [...ast.path],
  properties: ast.properties.map(cloneObjectProperty),
  type: ast.type,
});

const cloneObjectProperty = (ast: ASTObjectProperty): ASTObjectProperty => ({
  comments: cloneComments(ast.comments),
  key: ast.key,
  path: [...ast.path],
  type: ast.type,
  value: ast.value ? clone(ast.value) : undefined,
});

const cloneBoolean = (ast: ASTBoolean): ASTBoolean => ({
  comments: cloneComments(ast.comments),
  type: ast.type,
  value: ast.value,
});

const cloneNull = (ast: ASTNull): ASTNull => ({
  comments: cloneComments(ast.comments),
  type: ast.type,
  value: ast.value,
});

const cloneNumber = (ast: ASTNumber): ASTNumber => ({
  comments: cloneComments(ast.comments),
  type: ast.type,
  value: ast.value,
});

const cloneString = (ast: ASTString): ASTString => ({
  comments: cloneComments(ast.comments),
  type: ast.type,
  value: ast.value,
});

type ASTCloneable = ASTArray | ASTBoolean | ASTNull | ASTNumber | ASTObject | ASTObjectProperty | ASTString;

export function clone<N extends ASTCloneable>(ast: N): N {
  if (isArray(ast)) {
    return cloneArray(ast) as N;
  }
  if (isBoolean(ast)) {
    return cloneBoolean(ast) as N;
  }
  if (isNull(ast)) {
    return cloneNull(ast) as N;
  }
  if (isNumber(ast)) {
    return cloneNumber(ast) as N;
  }
  if (isObject(ast)) {
    return cloneObject(ast) as N;
  }
  if (isObjectProperty(ast)) {
    return cloneObjectProperty(ast) as N;
  }
  if (isString(ast)) {
    return cloneString(ast) as N;
  }

  throw new Error('Trying to clone a non-cloneable node.');
}
