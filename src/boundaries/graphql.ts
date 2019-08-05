import { ApolloServer, Config } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';

import { TypegooseMiddleware } from '~/middlewares/typegoose';

// Resolvers
import { UsersResolver } from '../modules/user/UserResolver';

import logger from '~/logger';
import app from './rest';

export let server: ApolloServer;

export async function start() {
  const options: Config = {
    schema: await buildSchema({
      resolvers: [UsersResolver],
      // NOTE: should be true for 'class-validator' work properly
      validate: true,
      globalMiddlewares: [TypegooseMiddleware],
      emitSchemaFile: true,
    }),
    introspection: true,
    playground: true,
    formatError: (error: any) => {
      logger.error(error);
      return error;
    },
    extensions: [],
  };

  server = new ApolloServer(options);
  server.applyMiddleware({ app });
  logger.info('GraphQL is ready');
}

export async function stop() {
  logger.info('GraphQL stopped');
  await server.stop();
}
