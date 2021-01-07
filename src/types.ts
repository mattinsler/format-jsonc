export interface ASTBoolean {
  comments: ASTComments;
  type: 'Boolean';
  value: boolean;
}
export interface ASTNull {
  comments: ASTComments;
  type: 'Null';
  value: null;
}
export interface ASTNumber {
  comments: ASTComments;
  type: 'Number';
  value: number;
}
export interface ASTString {
  comments: ASTComments;
  type: 'String';
  value: string;
}

export type ASTPrimitive = ASTBoolean | ASTNull | ASTNumber | ASTString;

export interface ASTCommentBlock {
  type: 'Block';
  value: string[];
}
export interface ASTCommentLine {
  type: 'Line';
  value: string;
}
export type ASTComment = ASTCommentBlock | ASTCommentLine;
export interface ASTComments {
  leading: ASTComment[];
  trailing: ASTComment[];
}

export interface ASTObjectProperty {
  comments: ASTComments;
  key: string;
  path: string[];
  type: 'ObjectProperty';
  value?: ASTArray | ASTObject | ASTPrimitive;
}

export interface ASTObject {
  comments: ASTComments;
  path: string[];
  properties: ASTObjectProperty[];
  type: 'Object';
}

export interface ASTArray {
  comments: ASTComments;
  items: Array<ASTArray | ASTObject | ASTPrimitive>;
  path: string[];
  type: 'Array';
}

export type ASTNode = ASTArray | ASTObject | ASTObjectProperty | ASTPrimitive;
export type ASTNodeWithPath = ASTArray | ASTObject | ASTObjectProperty;

export interface Path<N extends ASTNode> {
  children: { index?: number; key?: number | string; node: ASTNode }[];
  inList: boolean;
  listIndex: number;
  node: N;
  nodeType: N['type'];
  parent: Path<ASTNode> | null;
  path: Array<number | string>;
}

export type Visit<N extends ASTNode> =
  | ((path: Path<N>) => void)
  | {
      enter?: (path: Path<N>) => void;
      exit?: (path: Path<N>) => void;
    };

export interface Visitor {
  Array?: Visit<ASTArray>;
  Boolean?: Visit<ASTBoolean>;
  Null?: Visit<ASTNull>;
  Number?: Visit<ASTNumber>;
  String?: Visit<ASTString>;
  Object?: Visit<ASTObject>;
  ObjectProperty?: Visit<ASTObjectProperty>;
}
