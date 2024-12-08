import { ErrorCode } from './code';
import { HttpError } from './http-error';

export class DataNotFoundError extends HttpError {
  constructor(message = 'Data not found', cause?: Error) {
    super(ErrorCode.DATA_NOT_FOUND, message, cause);
  }
}
