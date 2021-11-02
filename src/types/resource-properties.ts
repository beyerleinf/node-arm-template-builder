export type BaseResourceProperties<T> = {
  name: string;
  location: string;
  properties: T;
};

export type AdditionalResourceProperties<T> = {
  [P in keyof T]: T[P];
};

export type ResourceProperties<T, K> = BaseResourceProperties<T> & AdditionalResourceProperties<K>;
