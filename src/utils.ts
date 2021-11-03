export type LiteralArgType = string | number | boolean;

const wrapString = (begin: string, end: string) => {
  return (strings: TemplateStringsArray, ...args: LiteralArgType[]) => {
    return `${begin}${strings.reduce((x, y, i) => (x += y + (args[i] || '') || ''), '')}${end}`;
  };
};

/**
 * Utility function to create a template expression.
 *
 * ### Basic Usage
 *
 * ```ts
 *  const myExpression = expr`something`;
 *  console.log(myExpression) // => '[something]'
 * ```
 *
 * @see https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-expressions
 */
export const expr = wrapString('[', ']');
