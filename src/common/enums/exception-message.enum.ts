export enum ExceptionMessage {
  userExists = 'User already exists',
  invalidCredentials = 'Wrong credentials provided',
  userNotFound = 'User doesn`t exist',
  sessionNotFound = 'Session doesn`t exist',
  tokensNotMatch = 'The received token and the token from the database don`t match',
  unauthorized = 'Authentication token is missing.',
  internalServerError = 'Internal server error',
  tokenTimeout = 'Token time is over',
}
