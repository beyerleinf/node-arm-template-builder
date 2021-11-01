import { Parameter } from './parameter';
import { Output } from './output';
import { Resource } from './resources';

export class ARMTemplateBuilder {
  addOutput(output: Output) {
    throw new Error('Not implemented');
  }

  addParameter(parameter: Parameter) {
    throw new Error('Not implemented');
  }

  addResource<T>(resource: Resource<T>) {
    throw new Error('Not implemented');
  }

  build() {
    throw new Error('Not implemented');
  }

  private validate(): boolean {
    throw new Error('Not implemented');
  }
}
