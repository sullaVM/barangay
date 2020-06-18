import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as ehbs from 'express-handlebars';
import * as express from 'express';
import * as morgan from 'morgan';
import { check } from 'express-validator';
import { Express, RequestHandler } from 'express';

import {
  clearSession,
  hello,
  isLoggedIn,
  loginGet,
  newSession,
} from './routes';

const attachRoutes = (app: Express, csrf: RequestHandler): void => {
  app.get('/', isLoggedIn, hello);
  app.get('/login', csrf, loginGet);

  app.get('/api/logout', clearSession);

  app.post('/api/newSession', csrf, [check('token').notEmpty()], newSession);
};

export default (): Express => {
  const app = express.default();
  const csrf = csurf.default({ cookie: true });

  app.disable('x-powered-by');
  app.engine('.hbs', ehbs.default({ extname: '.hbs' }));
  app.set('view engine', '.hbs');
  app.set('trust proxy', true);
  app.use(morgan.default('dev'));
  app.use(express.static('assets'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser.default());

  attachRoutes(app, csrf);
  return app;
};
