import { RequestWithUser } from 'src/modules/auth/types/request-with-user.interface';
import { AppEnvironment } from '../enums/app-environment.enum';

const REQUEST_COMMON_DATA = (req: RequestWithUser) =>
  `[METHOD]: ${req.method} [URL]: ${req.baseUrl} [QUERY]: ${JSON.stringify(
    req.query,
  )}`;

const REQUEST_PAYLOADS = (req: RequestWithUser) =>
  `[BODY]: ${JSON.stringify(req.body)} [USER]: ${JSON.stringify(req.user)}`;

const REQUEST_COOKIES = (req: RequestWithUser) =>
  `[COOKIES]: ${JSON.stringify(req.cookies)}`;

const REQUEST_HEADERS = (req: RequestWithUser) =>
  `[HEADERS]: ${JSON.stringify(req.headers)}`;

const DEV_LOG = (req: RequestWithUser) => {
  return `${REQUEST_COMMON_DATA(req)} ${REQUEST_PAYLOADS(
    req,
  )} ${REQUEST_COOKIES(req)} ${REQUEST_HEADERS(req)}`;
};

const PROD_LOG = (req: RequestWithUser) => {
  return `${REQUEST_COMMON_DATA(req)}`;
};

export const getRequestInformation = (
  appEnvironment: string,
  req: RequestWithUser,
) => {
  switch (appEnvironment) {
    case AppEnvironment.dev:
      return DEV_LOG(req);

    case AppEnvironment.prod:
      return PROD_LOG(req);

    default:
      return `[UNKNOWN_APP_ENVIRONMENT] ${DEV_LOG(req)}`;
  }
};
