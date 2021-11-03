export function uniqueString(...value: string[] | string[][]) {
  if (isStringArray(value)) {
    return `uniqueString(${value.join(',')})`;
  } else {
    return `uniqueString(${convertArray(value)})`;
  }
}

export function concat(...value: string[] | string[][]) {
  if (isStringArray(value)) {
    return `concat(${value.join(',')})`;
  } else {
    return `concat(${convertArray(value)})`;
  }
}

export function take(value: string | string[], numberToTake: number) {
  if (typeof value === 'string') {
    return `take(${value},${numberToTake})`;
  } else {
    return `take([${value.join(',')}],${numberToTake})`;
  }
}

function convertArray(value: string[][]): string {
  return value
    .map(x => x.join(','))
    .map(x => `[${x}]`)
    .join(',');
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function isStringArray(arg: any): arg is string[] {
  return Array.isArray(arg) && arg.every(e => typeof e === 'string');
}
