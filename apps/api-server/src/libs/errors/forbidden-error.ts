import { ErrorCode } from './code';
import { HttpError } from './http-error';

export class ForbiddenError extends HttpError {
  constructor(message = 'You are not allowed to access the resources requested', cause?: Error) {
    super(ErrorCode.FORBIDDEN_ERROR, message, cause);
  }
}
