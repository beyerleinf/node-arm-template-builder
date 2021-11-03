import { Resource } from './resource';
import { ResourceProperties } from '../types';

/**
 * This resource can create any resource in an ARM template.
 * This should only be used of there is no concrete resource for what you want to do.
 */
export class UntypedResource<T, K> extends Resource<T, K> {
  constructor(public readonly type: string, properties: ResourceProperties<T, K>) {
    super(properties);
  }

  get resourceId() {
    return `resourceId('${this.type}', ${this._properties.name})`;
  }
}
