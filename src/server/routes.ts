import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import { createNewCookie, revokeCookie, verifyCookie } from '../firebase/auth';

export const hello = (_req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
};

export const loginGet = (req: Request, res: Response): void => {
  res.render('login', { asset: 'login', csrfToken: req.csrfToken() });
};

export const newSession = async (req: Request, res: Response):
Promise<void> => {
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
  }).redirect('/');
};

export const clearSession = async (req: Request, res: Response):
Promise<void> => {
  await revokeCookie(req.cookies.session);
  res.clearCookie('session').redirect('/login');
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.cookies.session) {
    return res.redirect('/login');
  }

  if (await verifyCookie(req.cookies.session)) {
    return next();
  }

  return res.redirect('/login');
};
