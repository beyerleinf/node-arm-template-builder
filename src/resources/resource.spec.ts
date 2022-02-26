import { expect } from 'chai';
import * as sinon from 'sinon';
import { ARMCircularDependencyError, ARMResourceAlreadyExistsError } from '../errors';
import { Tag } from '../tag';
import { ResourceProperties } from '../types';
import { Resource } from './resource';

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

describe('Resource', () => {
  const props: Readonly<ResourceProperties<TestProperties, TestAdditionalProperties>> = {
    location: 'someLocation',
    name: 'SomeName',
    properties: {
      something: 'hello',
    },
    sku: {
      hello: 'world',
    },
  };

  let resource: Resource<TestProperties, TestAdditionalProperties>;

  beforeEach(() => {
    resource = new TestResource(props);
  });

  describe('properties', () => {
    describe('properties', () => {
      it('should set properties', () => {
        expect(resource.properties).to.eql(props.properties);
      });
    });

    describe('name', () => {
      it('should return name', () => {
        expect(resource.name).to.eql(props.name);
      });
    });

    describe('location', () => {
      it('should return location', () => {
        expect(resource.location).to.eql(props.location);
      });
    });
  });

  describe('addDependency', () => {
    it('should add dependency', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
        sku: { hello: 'world' },
      });

      resource.addDependency(childResource);

      expect(resource.dependencies).to.have.a.lengthOf(1);
      expect(resource.dependencies).to.contain(childResource.resourceId);
    });

    it('should not add same dependency twice', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
        sku: { hello: 'world' },
      });

      resource.addDependency(childResource);
      resource.addDependency(childResource);

      expect(resource.dependencies).to.have.a.lengthOf(1);
      expect(resource.dependencies).to.contain(childResource.resourceId);
    });

    it('should throw ARMCircularDependencyError when resource is added to itself', () => {
      expect(() => {
        resource.addDependency(resource);
      }).to.throw(ARMCircularDependencyError);
    });

    it('should throw ARMCircularDependencyError when resource depends on the resource it is added to', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
        sku: { hello: 'world' },
      });

      childResource.addDependency(resource);

      expect(() => {
        resource.addDependency(childResource);
      }).to.throw(ARMCircularDependencyError);
    });
  });

  describe('addResource', () => {
    it('should add resource', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
        sku: { hello: 'world' },
      });

      resource.addResource(childResource);

      expect(resource.resources).to.have.a.lengthOf(1);
      expect(resource.resources).to.contain(childResource);
    });

    it('should throw ARMResourceAlreadyExistsError when resource was already added', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
        sku: { hello: 'world' },
      });

      resource.addResource(childResource);

      expect(() => {
        resource.addResource(childResource);
      }).to.throw(ARMResourceAlreadyExistsError);
    });

    it('should throw ARMCircularDependencyError when resource is adde to itseld', () => {
      expect(() => {
        resource.addResource(resource);
      }).to.throw(ARMCircularDependencyError);
    });

    it('should throw ARMCircularDependencyError when resource contains the resource it is added to', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
        sku: { hello: 'world' },
      });

      childResource.addResource(resource);

      expect(() => {
        resource.addResource(childResource);
      }).to.throw(ARMCircularDependencyError);
    });
  });

  describe('addTag', () => {
    it('should add tag', () => {
      const key = 'myKey';
      const value = 'myValue';
      const tag = new Tag(key, value);

      resource.addTag(tag);

      expect(resource.tags).to.have.a.lengthOf(1);
      expect(resource.tags.get(key)).to.eql(value);
    });

    it('should override value of existing tag', () => {
      const key = 'myKey';
      const value = 'myValue';
      const newValue = 'SomeOtherValue';
      const tag = new Tag(key, value);
      const newTag = new Tag(key, newValue);

      resource.addTag(tag);
      resource.addTag(newTag);
      expect(resource.tags).to.have.a.lengthOf(1);
      expect(resource.tags.get(key)).to.eql(newValue);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON', () => {
      const dependentResource = new TestResource({ ...props, name: 'someDependency' });
      const childResource = new TestResource({ ...props, name: 'someChild' });

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      sinon.stub(childResource, 'toJSON').returns({ prop: 'ChildResourceJSON' } as any);

      resource.addDependency(dependentResource);
      resource.addResource(childResource);
      resource.addTag(new Tag('myTag', 'myValue'));

      expect(JSON.stringify(resource)).to.eql(
        JSON.stringify({
          type: resource.type,
          name: resource.name,
          location: resource.location,
          tags: { myTag: 'myValue' },
          dependsOn: [dependentResource.resourceId],
          properties: props.properties,
          sku: props.sku,
          resources: [{ prop: 'ChildResourceJSON' }],
        })
      );
    });
  });
});
