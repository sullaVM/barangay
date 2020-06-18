import { config } from 'dotenv';
import * as frb from './firebase/init'; // eslint-disable-line
import * as srv from './server/init';

const bootstrap = (): void => {
  config();

  frb.default();
  const server = srv.default();
  const { PORT } = process.env;
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

bootstrap();
