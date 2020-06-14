import { config } from 'dotenv';

import { initServer } from './server/server';

const bootstrap = (): void => {
  config();

  const server = initServer();
  const { PORT } = process.env;
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

bootstrap();
