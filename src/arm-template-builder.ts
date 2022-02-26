import {
  ARMInvalidBuilderConfigError,
  ARMNoResourcesError,
  ARMResourceAlreadyExistsError,
  ARMTemplateBuilderConfig,
} from '.';
import { Resource } from './resources';

const DEFAULT_CONFIG: ARMTemplateBuilderConfig = {
  contentVersion: '1.0.0.0',
};

const SCHEMA = 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#';

const ALLOWED_API_PROFILES = [
  '2018-03-01-hybrid',
  '2019-03-01-hybrid',
  '2019-06-01-hybrid',
  '2019-07-01-hybrid',
  '2020-09-01-hybrid',
];

export class ARMTemplateBuilder {
  private _resources: Resource<unknown, unknown>[] = [];
  private _config: ARMTemplateBuilderConfig;

  constructor(config?: ARMTemplateBuilderConfig) {
    if (config) {
      if ('apiProfile' in config && !ALLOWED_API_PROFILES.find(x => x === config.apiProfile)) {
        throw new ARMInvalidBuilderConfigError('apiProfile');
      }

      this._config = config;
    } else {
      this._config = DEFAULT_CONFIG;
    }
  }

  get resources() {
    return this._resources;
  }

  /**
   * Add a resource to this builder.
   * @param resource The resource to be added.
   * @throws {@link ARMResourceAlreadyExistsError}
   */
  addResource<T, K>(resource: Resource<T, K>) {
    if (this._resources.find(x => x.resourceId === resource.resourceId)) {
      throw new ARMResourceAlreadyExistsError(resource.resourceId);
    }

    this._resources.push(resource);
  }

  /**
   * Output this builder as an ARM Template.
   *
   * @returns The generated ARM Template.
   * @throws {@link ARMNoResourcesError}
   */
  build() {
    if (this._resources.length === 0) {
      throw new ARMNoResourcesError();
    }

    return JSON.stringify({
      $schema: SCHEMA,
      contentVersion: this._config.contentVersion,
      resources: this._resources,
    });
  }
}
