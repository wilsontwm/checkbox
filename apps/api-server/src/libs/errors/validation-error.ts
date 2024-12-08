import { ErrorCode } from './code';
import { HttpError, IValidationError } from './http-error';

export class HttpValidationError extends HttpError {
  constructor(validationErrors: IValidationError[]) {
    const message = 'Validation failed. Please check your input.';
    super(ErrorCode.API_VALIDATION_ERROR, message);
    this.validationErrors = validationErrors;
  }
}
