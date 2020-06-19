export interface Dictionary {
  [key: string]: string;
}

export function objectToQuery(obj: Dictionary): string {
  return Object.keys(obj)
    .map(key => {
      // tslint:disable-next-line: no-any
      const value: string | number = isNaN(obj[key] as any)
        ? obj[key]
        : `'${obj[key]}'`;
      return `${key} = '${value}'`;
    })
    .join(',');
}
