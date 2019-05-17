import { extname, join } from 'path';
import { createConnection, Connection } from 'typeorm';

import config from '~/config';
import logger from '~/logger';

let connection: Connection | null = null;

export async function start() {
  if (!connection) {
    connection = await createConnection({
      type: 'mongodb',
      url: config.db.uri,
      logging: config.logLevel === 'trace',
      synchronize: true,
      entities: [join(__dirname, '..', 'entities', `*${extname(__filename)}`)],
      useNewUrlParser: true,
    });

    logger.info('Connected to MongoDB');
  }
}

export async function stop() {
  if (connection) {
    await connection.close();
    connection = null;
    logger.info('Disconnected from MongoDB');
  }
}