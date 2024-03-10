import { Inject } from './inject';

import type { Constructable } from '../core/constructable';

type Fields<T> = {
  [P in keyof T]: Constructable<T[P]>;
};

type ResultFields<T> = {
  [P in keyof T]: T[P];
};

export function getInstances<T>(fields: Fields<T>): ResultFields<T> {
  const keys = Object.keys(fields) as (keyof T)[];
  return keys.reduce((acc, fieldKey) => {
    acc[fieldKey] = Inject(fields[fieldKey]);
    return acc;
  }, {} as ResultFields<T>);
}
