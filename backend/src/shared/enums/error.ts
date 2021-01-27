export enum Errors {
  // 400
  BAD_REQUEST = 'bad_request',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',

  // 500
  UNEXPECTED = 'unexpected',
}

export enum CodeErrors {
  // 400
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  // 500
  UNEXPECTED = 500,
}
