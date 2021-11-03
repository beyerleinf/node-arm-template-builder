export type BaseResourceProperties<T> = {
  name: string;
  location: string;
  properties: T;
};

export type ResourceProperties<T, K> = BaseResourceProperties<T> & K;
