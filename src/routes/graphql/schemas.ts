import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema, buildSchema } from 'graphql';

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
