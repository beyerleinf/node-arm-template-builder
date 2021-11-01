export class ARMCircularDependencyError extends Error {
  constructor(parent: string, child: string, field: string) {
    super(`Adding resource ${child} to '${field}' of resource ${parent} is a circular dependency.`);

    this.name = ARMCircularDependencyError.name;

    Error.captureStackTrace(this);
  }
}
