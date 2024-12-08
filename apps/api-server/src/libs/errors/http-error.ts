export type IValidationError = {
  path: string;
  message: string;
};

export class HttpError extends Error {
  private readonly cause?: Error;

  public readonly error_code: string;
  public override readonly message: string;
  public validationErrors?: IValidationError[];

  public override name = this.constructor.name;

  constructor(error_code: string, message: string, cause?: Error) {
    super(message);
    this.error_code = error_code;
    this.message = message;

    if (cause) {
      this.cause = cause;
      this.stack = cause && cause.stack;
    }
  }

  getCause(): Error | undefined {
    return this.cause;
  }
}
