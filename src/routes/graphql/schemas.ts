import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { UUID } from 'crypto';
import { MemberTypeId } from '../member-types/schemas.js';
import type { User, Profile } from './types/models.js';
interface Context {
  prisma: PrismaClient;
}

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

// ----- old graphql syntax

const GraphQLMemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLMemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      resolve: async (root: User, args, context: Context) =>
        await context.prisma.profile.findUnique({
          where: { userId: root.id },
        }),
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (root: User, args, context: Context) =>
        await context.prisma.post.findMany({
          where: { authorId: root.id },
        }),
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (root: User, args, context: Context) => 
        await context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: root.id,
              },
            },
          },
        }),
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (root: User, args, context: Context) =>
        await context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: root.id,
              },
            },
          },
        }),
    },
  }),
});

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: GraphQLMemberTypeId },
    memberType: {
      type: MemberType,
      resolve: async (root: Profile, args, context: Context) =>
        await context.prisma.memberType.findUnique({
          where: { id: root.memberTypeId },
        }),
    },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    // MemberType
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (root, args, context: Context) =>
        await context.prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: { id: { type: GraphQLMemberTypeId } },
      resolve: async (root, args: { id: MemberTypeId }, context: Context) =>
        await context.prisma.memberType.findUnique({
          where: { id: args.id },
        }),
    },

    // Post
    posts: {
      type: new GraphQLList(Post),
      resolve: async (root, args, context: Context) =>
        await context.prisma.post.findMany(),
    },
    post: {
      type: Post,
      args: { id: { type: UUIDType } },
      resolve: async (root, args: { id: UUID }, context: Context) =>
        await context.prisma.post.findUnique({
          where: { id: args.id },
        }),
    },

    // User
    users: {
      type: new GraphQLList(User),
      resolve: async (root, args, context: Context) =>
        await context.prisma.user.findMany(),
    },
    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: async (root, args: { id: UUID }, context: Context) =>
        await context.prisma.user.findUnique({
          where: { id: args.id },
        }),
    },

    // Profile
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (root, args, context: Context) =>
        await context.prisma.profile.findMany(),
    },
    profile: {
      args: { id: { type: UUIDType } },
      type: Profile,
      resolve: async (root, args: { id: UUID }, context: Context) =>
        await context.prisma.profile.findUnique({
          where: { id: args.id },
        }),
    },
  }),
});

export const schema = new GraphQLSchema({
  query: Query,
});

//  ---  new graphql syntax
/*
export const schema: GraphQLSchema = buildSchema(`
  scalar UUID
  scalar MemberTypeId

  type MemberType {
    id: UUID!
    discount: Float
    postsLimitPerMonth: Int
  }

  type Post {
    id: UUID!
    title: String
    content: String
    authorId: UUID
  }

  type User {
    id: UUID!
    name: String
    balance: Float
    posts: [Post]
  }

  type Profile {
    id: UUID!
    isMale: Boolean
    yearOfBirth: Int
    userId: UUID,
    memberTypeId: UUID,
  }

  type Query {
    hello: String
    memberType(id: MemberTypeId): MemberType
    memberTypes: [MemberType]
    post(id: UUID!): Post
    posts: [Post]
    user(id: UUID!): User
    users: [User]
    profile(id: UUID!): Profile
    profiles: [Profile]
  }

  schema {
    query: Query
  }
`);
*/

/*
export const profileFields = {
  id: Type.String({
    format: 'uuid',
  }),
  isMale: Type.Boolean(),
  yearOfBirth: Type.Integer(),
  userId: userFields.id,
  memberTypeId: memberTypeFields.id,
};
*/
