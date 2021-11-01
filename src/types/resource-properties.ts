export interface ResourceProperties<T> {
  name: string;
  location: string;
  properties: T;
}
