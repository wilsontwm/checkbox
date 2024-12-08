import { ErrorCode, ErrorStatusCodeMapping, ForbiddenError, HttpError } from '@checkbox-api-server/libs/errors';
import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { ValidationError } from 'yup';

const getInstanceName = (instance: object) => {
  return get(instance, 'constructor.name', typeof instance);
};

const mapErrorCode = (error: Error) => {
  switch (getInstanceName(error)) {
    case ForbiddenError.name:
      return ErrorCode.FORBIDDEN_ERROR;
    case RangeError.name:
      return ErrorCode.BAD_REQUEST;
    case ValidationError.name:
      return ErrorCode.API_VALIDATION_ERROR;
    default:
      return ErrorCode.SERVER_ERROR;
  }
};

export function errorMiddleware(error: HttpError, req: Request, res: Response, next: NextFunction): void {
  const errorCode = mapErrorCode(error);
  const httpStatusCode = ErrorStatusCodeMapping.get(errorCode) || 500;
  const message = error.message || 'Something went wrong';
  const errors = error.validationErrors ?? [];

  res.status(httpStatusCode).send({
    message,
    error_code: errorCode,
    errors: errors?.length > 0 ? errors : undefined,
  });
}
