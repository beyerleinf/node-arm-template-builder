export class ARMResourceAlreadyExistsError extends Error {
  constructor(resource: string) {
    super(`The resource ${resource} already exists.`);

    this.name = ARMResourceAlreadyExistsError.name;

    Error.captureStackTrace(this);
  }
}
