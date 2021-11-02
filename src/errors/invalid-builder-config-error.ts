export class ARMInvalidBuilderConfigError extends Error {
  constructor(property: string) {
    super(`The builder config is invalid => '${property}'`);

    this.name = ARMInvalidBuilderConfigError.name;

    Error.captureStackTrace(this);
  }
}
