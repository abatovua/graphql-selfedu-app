import { connect, disconnect, Mongoose } from 'mongoose';

import config from '~/config';
import logger from '~/logger';

let connection: Mongoose | null = null;

export async function start() {
  if (!connection) {
    connection = await connect(
      config.db.uri,
      {
        useNewUrlParser: true,
      },
    );

    logger.info('Connected to MongoDB');
  }
}

export async function stop() {
  if (connection) {
    await disconnect();
    connection = null;
    logger.info('Disconnected from MongoDB');
  }
}
