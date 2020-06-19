export interface Dictionary {
  [key: string]: string;
}

export function objectToQuery(update: Dictionary): string {
  return Object.keys(update)
    .map(key => {
      // tslint:disable-next-line: no-any
      const value: string | number = isNaN(update[key] as any)
        ? update[key]
        : `'${update[key]}'`;
      return `${key} = '${value}'`;
    })
    .join(',');
}
