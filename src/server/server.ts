import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as ehbs from 'express-handlebars';
import * as express from 'express';
import * as morgan from 'morgan';
import {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { check, validationResult } from 'express-validator';

import {
  createNewCookie,
  revokeCookie,
  verifyCookie,
} from '../firebase/firebase';

const hello = (_req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
};

const loginGet = (req: Request, res: Response): void => {
  res.render('login', { csrfToken: req.csrfToken(), layout: false });
};

const newSession = async (req: Request, res: Response): Promise<void> => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(422).json({ errors: err.array() });
    return;
  }

  const expiresIn = 60 * 60 * 24 * 7 * 1000; // Expires in 7 days.
  const session = await createNewCookie(req.body.token, expiresIn);
  if (!session) {
    res.sendStatus(401);
    return;
  }
  res.cookie('session', session, {
    httpOnly: true,
    maxAge: expiresIn,
    secure: process.env.ENV === 'production',
  });
  res.redirect('/');
};

const clearSession = async (req: Request, res: Response): Promise<void> => {
  await revokeCookie(req.cookies.session);
  res.clearCookie('session');
  res.redirect('/login');
};

const isLoggedIn = async (req: Request, res: Response, next: NextFunction):
Promise<void> => {
  if (!req.cookies.session) {
    return res.redirect('/login');
  }

  if (await verifyCookie(req.cookies.session)) {
    return next();
  }

  return res.redirect('/login');
};

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
