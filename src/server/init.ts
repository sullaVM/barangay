import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import ehbs from 'express-handlebars';
import morgan from 'morgan';
import express, { Express } from 'express';

import attachRoutes from './routes'; //eslint-disable-line

export default (): Express => {
  const app = express();
  const csrf = csurf({ cookie: true });

  app.disable('x-powered-by');
  app.engine('.hbs', ehbs({ extname: '.hbs' }));
  app.set('view engine', '.hbs');
  app.set('trust proxy', true);
  app.use(morgan('dev'));
  app.use(express.static('assets'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  attachRoutes(app, csrf);
  return app;
};
