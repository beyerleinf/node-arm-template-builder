import { expect } from 'chai';
import * as sinon from 'sinon';
import { ARMTemplateBuilder } from './arm-template-builder';
import { ARMInvalidBuilderConfigError, ARMNoResourcesError, ARMResourceAlreadyExistsError } from './errors';
import { Resource } from './resources/resource';
import { ARMTemplateBuilderConfig, ResourceProperties } from './types';

interface TestProperties {
  something: string;
}

interface TestAdditionalProperties {
  sku: { hello: string };
}

class TestResource extends Resource<TestProperties, TestAdditionalProperties> {
  type = 'TEST/TEST';

  get resourceId() {
    return `TEST/TESTID/${this._properties.name}`;
  }
}

describe('ARMTemplateBuilder', () => {
  describe('addResource', () => {
    let builder: ARMTemplateBuilder;

    beforeEach(() => {
      builder = new ARMTemplateBuilder();
    });

    it('should add resource', () => {
      const props: Readonly<ResourceProperties<TestProperties, TestAdditionalProperties>> = {
        location: 'someLocation',
        name: 'SomeName',
        properties: {
          something: 'hello',
        },
        sku: { hello: 'world' },
      };

      const resource = new TestResource(props);

      builder.addResource(resource);

      expect(builder.resources).to.have.a.lengthOf(1);
      expect(builder.resources).to.contain(resource);
    });

    it('should throw ARMResourceAlreadyExistsError when resource was already added', () => {
      const props: Readonly<ResourceProperties<TestProperties, TestAdditionalProperties>> = {
        location: 'someLocation',
        name: 'SomeName',
        properties: {
          something: 'hello',
        },
        sku: { hello: 'world' },
      };

      const resource = new TestResource(props);

      builder.addResource(resource);

      expect(() => {
        builder.addResource(resource);
      }).to.throw(ARMResourceAlreadyExistsError);
    });
  });

  describe('build', () => {
    const defaultSchema = 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#';

    it('should throw ARMNoResourcesError when no resources were added', () => {
      expect(() => {
        new ARMTemplateBuilder().build();
      }).to.throw(ARMNoResourcesError);
    });

    describe('default config', () => {
      let builder: ARMTemplateBuilder;
      const defaultContentVersion = '1.0.0.0';

      beforeEach(() => {
        builder = new ARMTemplateBuilder();
      });

      it('should build template', () => {
        const props: Readonly<ResourceProperties<TestProperties, TestAdditionalProperties>> = {
          location: 'someLocation',
          name: 'SomeName',
          properties: {
            something: 'hello',
          },
          sku: { hello: 'world' },
        };
        const resource = new TestResource(props);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sinon.stub(resource, 'toJSON').returns({ prop: 'ResourceJSON' } as any);

        builder.addResource(resource);

        expect(builder.build()).to.eql(
          JSON.stringify({
            $schema: defaultSchema,
            contentVersion: defaultContentVersion,
            resources: [{ prop: 'ResourceJSON' }],
          })
        );
      });
    });

    describe('custom config', () => {
      let builder: ARMTemplateBuilder;

      const config: ARMTemplateBuilderConfig = {
        contentVersion: '2.0.0.0',
      };

      beforeEach(() => {
        builder = new ARMTemplateBuilder(config);
      });

      it('should build template', () => {
        const props: Readonly<ResourceProperties<TestProperties, TestAdditionalProperties>> = {
          location: 'someLocation',
          name: 'SomeName',
          properties: {
            something: 'hello',
          },
          sku: { hello: 'world' },
        };
        const resource = new TestResource(props);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sinon.stub(resource, 'toJSON').returns({ prop: 'ResourceJSON' } as any);

        builder.addResource(resource);

        expect(builder.build()).to.eql(
          JSON.stringify({
            $schema: defaultSchema,
            contentVersion: config.contentVersion,
            resources: [{ prop: 'ResourceJSON' }],
          })
        );
      });
    });

    describe('invalid config', () => {
      it('should throw ARMInvalidBuilderConfigError when apiProfile is invalid', () => {
        expect(() => {
          new ARMTemplateBuilder({ contentVersion: '1.1.0.0', apiProfile: '1337-lul' });
        }).to.throw(ARMInvalidBuilderConfigError, "The builder config is invalid => 'apiProfile'");
      });
    });
  });
});
