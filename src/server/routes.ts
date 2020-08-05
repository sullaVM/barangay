import { formatISO } from 'date-fns';
import {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import {
  createNewCookie,
  createNewUser,
  revokeCookie,
  verifyCookie,
  verifyToken,
} from '../firebase/auth/auth';
import { getRecords, storeRecord } from '../firebase/store/store';
import { RecordUpload, RoleInfo } from '../firebase/store/types';

const hello = (_req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
};

const dashboardGet = (_req: Request, res: Response): void => {
  res.render('dashboard', {
    layout: 'main',
  });
};

const loginGet = (req: Request, res: Response): void => {
  res.render('login', {
    layout: 'login',
    csrfToken: req.csrfToken(),
    css: 'login',
    js: 'login',
  });
};

const addPersonGet = (req: Request, res: Response): void => {
  res.render('addPerson', {
    csrfToken: req.csrfToken(),
    js: 'addPerson',
    title: 'Register a Resident',
    maxDate: formatISO(new Date(), { representation: 'date' }),
  });
};

const searchPersonGet = (_req: Request, res: Response): void => {
  res.render('searchPerson', { css: 'addPerson', js: 'searchPerson' });
};

const newSession = async (req: Request, res: Response):
Promise<void> => {
  if (!req.body.token) {
    res.status(400).json({ error: 'Missing token' });
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
  }).redirect('/');
};

const clearSession = async (req: Request, res: Response):
Promise<void> => {
  await revokeCookie(req.cookies.session);
  res.clearCookie('session').redirect('/login');
};

const addPersonPost = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.token) {
    res.status(400).json({ error: 'Missing token' });
    return;
  }

  const decoded = await verifyToken(req.body.token);
  if (!decoded) {
    res.status(401).json({ error: 'Bad token' });
    return;
  }

  if (!req.body.info) {
    res.status(400).json({ error: 'Missing info object' });
    return;
  }

  const { info } = req.body;
  const upperInfo = Object.keys(info).reduce((acc, k) => (
    typeof info[k] === 'string'
      ? { ...acc, [k]: info[k].toUpperCase() }
      : acc),
  info as RecordUpload);

  const now = new Date();
  const role: RoleInfo = { email: decoded.email, name: decoded.displayName };

  if (await storeRecord({
    ...upperInfo,
    dateAccomplished: now,
    lastChanged: { role, timestamp: now },
    submittedByRole: role,
  })) {
    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }
};

const searchPersonPost = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.token) {
    res.status(400).json({ error: 'Missing token' });
    return;
  }

  const decoded = await verifyToken(req.body.token);
  if (!decoded) {
    res.status(401).json({ error: 'Bad token' });
    return;
  }

  if (!req.body.info) {
    res.status(400).json({ error: 'Missing info object' });
    return;
  }

  res.json(await getRecords(req.body.info));
};

const newUserWithKey = async (req: Request, res: Response): Promise<void> => {
  if (req.query.key !== process.env.SECRET_KEY) {
    res.status(401).send('Bad access key');
    return;
  }

  if (!req.query.name || !req.query.email) {
    res.status(400).send('Missing query parameters "name" or "email"');
    return;
  }

  const { name, email, password } = req.query;
  res.json(await createNewUser(
    name.toString(),
    email.toString(),
    password.toString(),
  ));
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

export default (app: Express, csrf: RequestHandler): void => {
  app.get('/', isLoggedIn, dashboardGet);
  app.get('/login', csrf, loginGet);
  app.get('/addPerson', csrf, addPersonGet);
  app.get('/searchPerson', searchPersonGet);
  app.get('/api/logout', clearSession);
  app.get('/api/access/newAccount', newUserWithKey);

  app.post('/api/newSession', csrf, newSession);
  app.post('/api/addPerson', csrf, addPersonPost);
  app.post('/api/searchPerson', searchPersonPost);
};
