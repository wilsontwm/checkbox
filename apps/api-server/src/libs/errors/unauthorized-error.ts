import { ErrorCode } from './code';
import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized access, please login first', cause?: Error) {
    super(ErrorCode.UNAUTHORIZED, message, cause);
  }
}
