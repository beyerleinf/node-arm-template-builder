export class ARMNoResourcesError extends Error {
  constructor() {
    super('No resources exists in this builder.');

    this.name = ARMNoResourcesError.name;

    Error.captureStackTrace(this);
  }
}
