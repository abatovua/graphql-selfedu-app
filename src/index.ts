import 'reflect-metadata';

import { bootstrap } from '~/bootstraper';
import * as database from '~/boundaries/database';
import * as httpServer from '~/boundaries/http-server';
import * as graphql from '~/boundaries/graphql';

async function start() {
  await database.start();
  await graphql.start();
  await httpServer.start();
}

async function stop() {
  await database.stop();
  await graphql.stop();
  await httpServer.stop();
}

if (!module.parent) {
  // tslint:disable-next-line
  bootstrap(start, stop);
}
