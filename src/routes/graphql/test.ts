import { PrismaClient } from '@prisma/client';
import { DefaultArgs, PrismaClientOptions } from '@prisma/client/runtime/library.js';
import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  buildSchema,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

interface Context {
  prisma: PrismaClient<PrismaClientOptions, never, DefaultArgs>;
}

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: async (root, args, context: Context) =>
        await context.prisma.user.findMany(),
    },
  },
});

export const schemaTest = new GraphQLSchema({
  query: Query,
});

// export const schemaTest: GraphQLSchema = buildSchema(`
//   scalar UUID

//   type User {
//     id: UUID!
//     name: String
//     balance: Float
//   }

//   type Query {
//     users: [User]
//   }
// `);

export const resolverTest = {
  users: async (root, args, context: Context, info) =>
    await context.prisma.user.findMany(),
};

export const buildResolverTest = (prisma) => ({
  user: () => ({ name: 'Alex' }),
  // User: {
  //   name: () => 'Alex',
  //   greeting: () => ({ message: 'message' }),
  // },
  Greeting: {
    message: () => ({ message: 'message' }),
  },
});
