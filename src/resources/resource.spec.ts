import { expect } from 'chai';
import { Resource } from './resource';
import { Tag } from '../tag';
import { ResourceProperties } from '../types';
import { ARMCircularDependencyError } from '../errors';

interface TestProperties {
  something: string;
}

class TestResource extends Resource<TestProperties> {
  type = 'TEST/TEST';

  get resourceId() {
    return `TEST/TESTID/${this._properties.name}`;
  }
}

describe('Resource', () => {
  const props: Readonly<ResourceProperties<TestProperties>> = {
    location: 'someLocation',
    name: 'SomeName',
    properties: {
      something: 'hello',
    },
  };

  let resource: Resource<TestProperties>;

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

  describe('addDependecy', () => {
    it('should add dependency', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
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
      });

      resource.addResource(childResource);

      expect(resource.resources).to.have.a.lengthOf(1);
      expect(resource.resources).to.contain(childResource);
    });

    it('should not add the same resource twice', () => {
      const childResource = new TestResource({
        location: 'somewhere',
        name: 'Child',
        properties: { something: 'world' },
      });

      resource.addResource(childResource);
      resource.addResource(childResource);

      expect(resource.resources).to.have.a.lengthOf(1);
      expect(resource.resources).to.contain(childResource);
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
});
