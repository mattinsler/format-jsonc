import fs from 'fs';
import * as babel from '@babel/core';

import {
  ASTArray,
  ASTBoolean,
  ASTCommentBlock,
  ASTCommentLine,
  ASTComments,
  ASTNull,
  ASTNumber,
  ASTObject,
  ASTObjectProperty,
  ASTString,
} from './types';
import { isArray, isObject, isObjectProperty } from './tools';

function parseComments(node: babel.types.Node): ASTComments {
  function parseCommentBlock(comment: babel.types.CommentBlock): ASTCommentBlock {
    const lines = comment.value.split('\n');
    if (lines.length > 1) {
      for (let x = 1; x < lines.length; ++x) {
        lines[x] = lines[x].slice(comment.loc.start.column);
      }
    }
    return {
      type: 'Block',
      value: lines,
    };
  }
  function parseCommentLine(comment: babel.types.CommentLine): ASTCommentLine {
    return {
      type: 'Line',
      value: comment.value,
    };
  }

  return {
    leading: (node.leadingComments || []).map((comment) =>
      comment.type === 'CommentLine' ? parseCommentLine(comment) : parseCommentBlock(comment)
    ),
    trailing: (node.trailingComments || []).map((comment) =>
      comment.type === 'CommentLine' ? parseCommentLine(comment) : parseCommentBlock(comment)
    ),
  };
}

export function parse(content: string): ASTObject {
  let ast: ASTObject;
  const stack: Array<ASTObject | ASTObjectProperty | ASTArray> = [];
  const keyPath: string[] = [];

  const parsed = babel.parseSync(`(${content})`);
  if (parsed === null) {
    throw new Error();
  }

  babel.traverse(parsed, {
    ObjectExpression: {
      enter({ node }) {
        const obj: ASTObject = {
          type: 'Object',
          properties: [],
          comments: parseComments(node),
          path: [...keyPath],
        };

        if (stack.length === 0) {
          ast = obj;
        } else if (isObjectProperty(stack[0])) {
          stack[0].value = obj;
        } else if (isArray(stack[0])) {
          stack[0].items.push(obj);
        } else {
          throw new Error(`ObjectExpression enter issue:\n${JSON.stringify(stack[0], null, 2)}`);
        }

        stack.unshift(obj);
      },
      exit() {
        stack.shift();
      },
    },
    ObjectProperty: {
      enter({ node }) {
        const prop: ASTObjectProperty = {
          type: 'ObjectProperty',
          key: (node.key as babel.types.StringLiteral).value,
          comments: parseComments(node),
          path: [...keyPath],
          value: undefined,
        };
        keyPath.push(prop.key);

        if (isObject(stack[0])) {
          stack[0].properties.push(prop);
        } else {
          throw new Error(`ObjectProperty enter issue:\n${JSON.stringify(stack[0], null, 2)}`);
        }

        stack.unshift(prop);
      },
      exit() {
        stack.shift();
        keyPath.pop();
      },
    },
    ArrayExpression: {
      enter({ node }) {
        const arr: ASTArray = {
          type: 'Array',
          items: [],
          comments: parseComments(node),
          path: [...keyPath],
        };

        if (isObjectProperty(stack[0])) {
          stack[0].value = arr;
        } else if (isArray(stack[0])) {
          stack[0].items.push(arr);
        } else {
          throw new Error(`ArrayExpression enter issue:\n${JSON.stringify(stack[0], null, 2)}`);
        }

        stack.unshift(arr);
      },
      exit() {
        stack.shift();
      },
    },
    BooleanLiteral(path) {
      const bool: ASTBoolean = {
        type: 'Boolean',
        value: path.node.value,
        comments: parseComments(path.node),
      };

      if (isObjectProperty(stack[0]) && path.key === 'value') {
        stack[0].value = bool;
      } else if (stack[0].type === 'Array') {
        stack[0].items.push(bool);
      }
    },
    NullLiteral(path) {
      const n: ASTNull = {
        type: 'Null',
        value: null,
        comments: parseComments(path.node),
      };

      if (isObjectProperty(stack[0]) && path.key === 'value') {
        stack[0].value = n;
      } else if (stack[0].type === 'Array') {
        stack[0].items.push(n);
      }
    },
    NumericLiteral(path) {
      const num: ASTNumber = {
        type: 'Number',
        value: path.node.value,
        comments: parseComments(path.node),
      };

      if (isObjectProperty(stack[0]) && path.key === 'value') {
        stack[0].value = num;
      } else if (stack[0].type === 'Array') {
        stack[0].items.push(num);
      }
    },
    StringLiteral(path) {
      const str: ASTString = {
        type: 'String',
        value: path.node.value,
        comments: parseComments(path.node),
      };

      if (isObjectProperty(stack[0]) && path.key === 'value') {
        stack[0].value = str;
      } else if (stack[0].type === 'Array') {
        stack[0].items.push(str);
      }
    },
  });

  // @ts-expect-error Variable 'ast' is used before being assigned. ts(2454)
  if (!ast) {
    throw new Error('No JSONC object found');
  }

  return ast;
}

export async function parseFile(file: string): Promise<ASTObject> {
  return parse(await fs.promises.readFile(file, 'utf-8'));
}

export function parseFileSync(file: string): ASTObject {
  return parse(fs.readFileSync(file, 'utf-8'));
}
