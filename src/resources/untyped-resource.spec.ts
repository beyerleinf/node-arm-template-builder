import { expect } from 'chai';
import { UntypedResource } from '.';

describe('UntypedResource', () => {
  it('should set correct type', () => {
    const resource = new UntypedResource('My/Type', { location: 'location', name: 'name', properties: {} });

    expect(resource.type).to.eql('My/Type');
  });

  it('should return correct resourceId', () => {
    const resource = new UntypedResource('My/Type', { location: 'location', name: 'name', properties: {} });

    expect(resource.resourceId).to.eql("resourceId('My/Type', name)");
  });
});
