export type DictionaryTypeValue = string | boolean | number;

export interface Dictionary {
  [key: string]: DictionaryTypeValue;
}

export function objectToQueryUpdate(obj: Dictionary): string {
  return Object.keys(obj)
    .map(key => {
      // tslint:disable-next-line: no-any
      const value: DictionaryTypeValue = isNaN(obj[key] as any)
        ? obj[key]
        : `'${obj[key]}'`;
      return `${key} = '${value}'`;
    })
    .join(',');
}

export function objectToQueryInsert(obj: Dictionary): string {
  return Object.values(obj)
    .map((value: DictionaryTypeValue) => {
      switch (typeof value) {
        case 'boolean':
          return value;
        case 'number':
          return value;
        default:
          return `'${value}'`;
      }
    })
    .join(', ');
}
