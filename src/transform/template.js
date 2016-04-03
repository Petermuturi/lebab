import estraverse from 'estraverse';
import TemplateLiteral from './../syntax/template-literal';
import isString from './../utils/is-string';
import _ from 'lodash';

export default function(ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (isPlusExpression(node)) {
        const operands = detectOperands(node);

        if (operands.some(isString)) {
          this.skip();
          return new TemplateLiteral(operands);
        }
      }
    }
  });
}

function detectOperands(node) {
  if (isPlusExpression(node)) {
    return _.flatten([
      detectOperands(node.left),
      detectOperands(node.right)
    ]);
  }
  else {
    return [node];
  }
}

function isPlusExpression(node) {
  return node.type === 'BinaryExpression' && node.operator === '+';
}
