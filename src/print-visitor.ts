import { ASTComments, ASTPrimitive, Path, Visitor } from './types';
import { isObjectProperty } from './tools';

export function createPrintVisitor(tokens: string[]): Visitor {
  let indent = '';

  function addLeadingComments(comments: ASTComments) {
    comments.leading.forEach((comment) => {
      if (comment.type === 'Line') {
        tokens.push(indent, '//', comment.value, '\n');
      } else if (comment.type === 'Block') {
        if (comment.value.length === 1) {
          tokens.push(indent, '/*', comment.value[0], '*/', '\n');
        } else {
          tokens.push(indent, '/*', comment.value[0], '\n');
          comment.value.slice(1, -1).forEach((line) => tokens.push(indent, line, '\n'));
          tokens.push(indent, comment.value[comment.value.length - 1], '*/', '\n');
        }
      }
    });
  }

  function printPrimitive(path: Path<ASTPrimitive>) {
    addLeadingComments(path.node.comments);
    if (path.parent && !isObjectProperty(path.parent)) {
      tokens.push(indent);
    }
    tokens.push(JSON.stringify(path.node.value), ',', '\n');
  }

  return {
    Array: {
      enter(path) {
        addLeadingComments(path.node.comments);
        if (path.parent && path.parent.nodeType !== 'ObjectProperty') {
          tokens.push(indent);
        }
        if (path.node.items.length === 0) {
          tokens.push('[]');
        } else {
          tokens.push('[', '\n');
          indent += ' '.repeat(2);
        }
      },
      exit(path) {
        if (path.node.items.length > 0) {
          indent = indent.slice(0, -2);
          tokens.push(indent, ']');
        }
        if (path.parent) {
          tokens.push(',', '\n');
        }
      },
    },
    Boolean(path) {
      printPrimitive(path);
    },
    Null(path) {
      printPrimitive(path);
    },
    Number(path) {
      printPrimitive(path);
    },
    Object: {
      enter(path) {
        addLeadingComments(path.node.comments);
        if (path.parent && path.parent.nodeType !== 'ObjectProperty') {
          tokens.push(indent);
        }
        if (path.node.properties.length === 0) {
          tokens.push('{}');
        } else {
          tokens.push('{', '\n');
          indent += ' '.repeat(2);
        }
      },
      exit(path) {
        if (path.node.properties.length > 0) {
          indent = indent.slice(0, -2);
          tokens.push(indent, '}');
        }
        if (path.parent) {
          tokens.push(',', '\n');
        }
      },
    },
    ObjectProperty: {
      enter(path) {
        // adds a newline between keys only at the top level
        if (path.path.length === 1 && path.listIndex > 0) {
          tokens.push('\n');
        }
        addLeadingComments(path.node.comments);
        tokens.push(indent, JSON.stringify(path.node.key), ':', ' ');
      },
    },
    String(path) {
      printPrimitive(path);
    },
  };
}
