import { ErrorCode } from './code';

export const ErrorStatusCodeMapping = new Map<string, number>([
  [ErrorCode.API_VALIDATION_ERROR, 400],
  [ErrorCode.BAD_REQUEST, 400],
  [ErrorCode.BAD_GATEWAY, 502],
  [ErrorCode.UNAUTHORIZED, 401],
  [ErrorCode.SERVER_ERROR, 500],
  [ErrorCode.DATABASE_ERROR, 500],
  [ErrorCode.FORBIDDEN_ERROR, 403],
]);
