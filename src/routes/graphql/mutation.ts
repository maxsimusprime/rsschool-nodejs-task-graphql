import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Post, User, Profile, GraphQLMemberTypeId } from './query.js';
import { UUIDType } from './types/uuid.js';
import { Context } from './types/interfaces.js';
import { PostModel, ProfileModel, UserModel } from './types/models.js';

export type PostDto = {
  title: string;
  content: string;
  authorId: string;
};

export type UserDto = {
  name: string;
  balance: number;
};

export type ProfileDto = {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: 'basic' | 'business';
  userId: string;
};

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLMemberTypeId) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Post
    createPost: {
      type: Post,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (
        root,
        args: { dto: PostDto },
        context: Context,
      ): Promise<PostModel> => await context.prisma.post.create({ data: args.dto }),
    },

    // User
    createUser: {
      type: User,
      args: { dto: { type: CreateUserInput } },
      resolve: async (
        root,
        args: { dto: UserDto },
        context: Context,
      ): Promise<UserModel> => await context.prisma.user.create({ data: args.dto }),
    },

    createProfile: {
      type: Profile,
      args: { dto: { type: CreateProfileInput } },
      resolve: async (
        root,
        args: { dto: ProfileDto },
        context: Context,
      ): Promise<ProfileModel> => await context.prisma.profile.create({ data: args.dto }),
    },
  },
});
