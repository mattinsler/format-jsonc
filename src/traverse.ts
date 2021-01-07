import { ASTNode, Path, Visit, Visitor } from './types';
import { isArray, isObject, isObjectProperty } from './tools';

function visitFrom<N extends ASTNode>(node: N | Path<N>, visitor: Visitor): Visit<N> {
  const type = isPath(node) ? node.nodeType : node.type;
  return visitor[type] as Visit<N>;
}

function childrenOf<N extends ASTNode>(node: N): { index?: number; key?: number | string; node: ASTNode }[] {
  if (isArray(node)) {
    return node.items.map((node, index) => ({ index, key: index, node }));
  }
  if (isObject(node)) {
    return node.properties.map((node, index) => ({ index, key: node.key, node }));
  }
  if (isObjectProperty(node)) {
    return node.value ? [{ node: node.value }] : [];
  }

  // primitive
  return [];
}

function pathFrom<N extends ASTNode>(
  { index, key, node }: { index?: number; key?: number | string; node: N },
  parent: Path<ASTNode> | null
): Path<N> {
  return {
    children: childrenOf(node),
    inList: typeof index === 'number',
    listIndex: typeof index === 'number' ? index : -1,
    node,
    nodeType: node.type,
    parent,
    path: parent ? (key === undefined ? [...parent.path] : [...parent.path, key]) : [],
  };
}

function hasEnter<N extends ASTNode>(visit: Visit<N>): visit is { enter: (path: Path<N>) => void } {
  return visit && typeof (visit as any).enter === 'function';
}
function hasExit<N extends ASTNode>(visit: Visit<N>): visit is { exit: (path: Path<N>) => void } {
  return visit && typeof (visit as any).exit === 'function';
}
function hasHandler<N extends ASTNode>(visit: Visit<N>): visit is (path: Path<N>) => void {
  return visit && typeof visit === 'function';
}

function enter<N extends ASTNode>(visit: Visit<N>, path: Path<N>) {
  hasEnter(visit) && visit.enter(path);
}
function exit<N extends ASTNode>(visit: Visit<N>, path: Path<N>) {
  hasExit(visit) && visit.exit(path);
}
function handle<N extends ASTNode>(visit: Visit<N>, path: Path<N>) {
  hasHandler(visit) && visit(path);
}

function isPath<N extends ASTNode>(value: N | Path<N>): value is Path<N> {
  return typeof (value as Path<N>).nodeType === 'string';
}

export function traverse<N extends ASTNode>(node: N | Path<N>, visitor: Visitor) {
  const path = isPath(node) ? node : pathFrom({ node }, null);
  const visit = visitFrom(path, visitor);

  if (hasEnter(visit) || hasExit(visit)) {
    enter(visit, path);
    for (let child of path.children) {
      traverse(pathFrom(child, path), visitor);
    }
    exit(visit, path);
  } else if (hasHandler(visit)) {
    handle(visit, path);
  } else {
    for (let child of path.children) {
      traverse(pathFrom(child, path), visitor);
    }
  }
}
