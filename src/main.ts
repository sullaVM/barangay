import { config } from 'dotenv';
import * as initServer from './server/server'; // eslint-disable-line
import { initFirebase } from './firebase/firebase';

const bootstrap = (): void => {
  config();

  initFirebase();
  const server = initServer.default();
  const { PORT } = process.env;
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

bootstrap();
