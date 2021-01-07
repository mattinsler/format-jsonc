import {
  ASTArray,
  ASTNode,
  ASTBoolean,
  ASTNodeWithPath,
  ASTNull,
  ASTNumber,
  ASTObject,
  ASTObjectProperty,
  ASTPrimitive,
  ASTString,
  Path,
} from './types';

function isPath<N extends ASTNode>(value: N | Path<N>): value is Path<N> {
  return typeof (value as Path<N>).nodeType === 'string';
}

export function isArray(node: ASTNode): node is ASTArray;
export function isArray(path: Path<ASTNode>): path is Path<ASTArray>;
export function isArray(arg: ASTNode | Path<ASTNode>) {
  return (isPath(arg) ? arg.nodeType : arg.type) === 'Array';
}

export function isNodeWithPath(node: ASTNode): node is ASTNodeWithPath;
export function isNodeWithPath(path: Path<ASTNode>): path is Path<ASTNodeWithPath>;
export function isNodeWithPath(arg: ASTNode | Path<ASTNode>) {
  return Array.isArray(((isPath(arg) ? arg.node : arg) as ASTNodeWithPath).path);
}

export function isObject(node: ASTNode): node is ASTObject;
export function isObject(path: Path<ASTNode>): path is Path<ASTObject>;
export function isObject(arg: ASTNode | Path<ASTNode>) {
  return (isPath(arg) ? arg.nodeType : arg.type) === 'Object';
}

export function isObjectProperty(node: ASTNode): node is ASTObjectProperty;
export function isObjectProperty(path: Path<ASTNode>): path is Path<ASTObjectProperty>;
export function isObjectProperty(arg: ASTNode | Path<ASTNode>) {
  return (isPath(arg) ? arg.nodeType : arg.type) === 'ObjectProperty';
}

export function isBoolean(node: ASTNode): node is ASTBoolean;
export function isBoolean(node: ASTNode): node is ASTBoolean;
export function isBoolean(arg: ASTNode | Path<ASTNode>) {
  return (isPath(arg) ? arg.nodeType : arg.type) === 'Boolean';
}

export function isNull(node: ASTNode): node is ASTNull;
export function isNull(path: Path<ASTNode>): path is Path<ASTNull>;
export function isNull(arg: ASTNode | Path<ASTNode>) {
  return (isPath(arg) ? arg.nodeType : arg.type) === 'Null';
}

export function isNumber(node: ASTNode): node is ASTNumber;
export function isNumber(path: Path<ASTNode>): path is Path<ASTNumber>;
export function isNumber(arg: ASTNode | Path<ASTNode>) {
  return (isPath(arg) ? arg.nodeType : arg.type) === 'Number';
}

export function isString(node: ASTNode): node is ASTString;
export function isString(path: Path<ASTNode>): path is Path<ASTString>;
export function isString(arg: ASTNode | Path<ASTNode>) {
  return (isPath(arg) ? arg.nodeType : arg.type) === 'String';
}

export function isPrimitive(node: ASTNode): node is ASTPrimitive;
export function isPrimitive(path: Path<ASTNode>): path is Path<ASTPrimitive>;
export function isPrimitive(arg: ASTNode | Path<ASTNode>) {
  const node = isPath(arg) ? arg.node : arg;
  return isBoolean(node) || isNull(node) || isNumber(node) || isString(node);
}
