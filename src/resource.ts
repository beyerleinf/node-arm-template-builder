import { ARMCircularDependencyError } from './errors';
import { Tag } from './tag';
import { ResourceID, ResourceProperties } from './types';

export abstract class Resource<TProps> {
  protected abstract readonly type: string;
  protected _properties: ResourceProperties<TProps>;
  protected _tags: Map<string, string> = new Map();
  protected _dependencies: ResourceID[] = [];
  protected _resources: Resource<unknown>[] = [];

  constructor(properties: ResourceProperties<TProps>) {
    this._properties = properties;
  }

  /**
   * Gets this resources Resource ID.
   */
  abstract get resourceId(): ResourceID;

  get name(): string {
    return this._properties.name;
  }

  get location(): string {
    return this._properties.location;
  }

  get tags(): Map<string, string> {
    return this._tags;
  }

  get properties(): TProps {
    return this._properties.properties;
  }

  /**
   * Get al child resources of this resource. This corresponds to the `resources` field.
   */
  get resources(): Resource<unknown>[] {
    return this._resources;
  }

  /**
   * Get all dependecies of ths resource. This corresponds to the `dependsOn` field.
   */
  get dependencies(): ResourceID[] {
    return this._dependencies;
  }

  /**
   * Add a resource as a dependecy to this resource.
   * @param resource The resource to be added.
   * @returns
   */
  addDependency<T>(resource: Resource<T>): void {
    if (this._dependencies.includes(resource.resourceId)) return;

    if (this.resourceId === resource.resourceId || resource.dependencies.includes(this.resourceId)) {
      throw new ARMCircularDependencyError(this.resourceId, resource.resourceId, 'dependsOn');
    }

    this._dependencies.push(resource.resourceId);
  }

  /**
   * Add a resource as a child resource to this resource.
   * @param resource The resource to be added.
   * @returns
   */
  addResource<T>(resource: Resource<T>) {
    if (this._resources.find(x => x.resourceId === resource.resourceId)) return;

    if (this.resourceId === resource.resourceId || resource.resources.find(x => x.resourceId === this.resourceId)) {
      throw new ARMCircularDependencyError(this.resourceId, resource.resourceId, 'resources');
    }

    this._resources.push(resource);
  }

  /**
   * Add a tag to this resource.
   * @param tag The tag to be added.
   */
  addTag(tag: Tag) {
    this._tags.set(tag.key, tag.value);
  }
}
