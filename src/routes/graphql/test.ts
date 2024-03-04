import { PrismaClient } from '@prisma/client';
import { GraphQLSchema, buildSchema } from 'graphql';

export const schemaTest: GraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

export const buildResolverTest = (prisma: PrismaClient) => {
  return ({
    Query: {
      hello: () => 'Hello, world!'
    }
  });
};
