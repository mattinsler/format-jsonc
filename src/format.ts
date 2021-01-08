import { clone } from './clone';
import { traverse } from './traverse';
import { ASTArray, ASTObject } from './types';
import { createPrintVisitor } from './print-visitor';
import { applyTransforms, Transform } from './transforms';

export function format(ast: ASTArray | ASTObject, transforms?: Transform[]): string {
  const tokens: string[] = [];

  if (transforms) {
    ast = clone(ast);
    applyTransforms(ast, transforms);
  }
  traverse(ast, createPrintVisitor(tokens));

  return tokens.join('');
}
