import * as express from 'express';
import * as morgan from 'morgan';
import { Express, Request, Response } from 'express';

const hello = (_req: Request, res: Response) => {
  res.send('Hello');
};

export const initServer = (): Express => {
  const app = express();

  app.use(morgan('dev'));

  app.get('/', hello);

  return app;
};
