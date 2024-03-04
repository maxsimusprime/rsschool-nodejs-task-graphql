import { type PrismaClient } from '@prisma/client';
import { UUID } from 'crypto';
import { MemberTypeId } from '../member-types/schemas.js';

export const buildResolver = (prisma: PrismaClient) => ({
  // users: async () => [{ id: 'id', name: 'name', balance: 11.22 }],
  Query: {
    memberType: async (args: { id: MemberTypeId }) =>
      await prisma.memberType.findUnique({
        where: { id: args.id },
      }),
    memberTypes: async () => await prisma.memberType.findMany(),

    post: async (args: { id: UUID }) =>
      await prisma.post.findUnique({
        where: { id: args.id },
      }),
    posts: async () => await prisma.post.findMany(),

    user: async (args: { id: UUID }) =>
      await prisma.user.findUnique({
        where: { id: args.id },
      }),
    users: async () => [{ id: 'id', name: 'name', balance: 11.22 }],
    // users: async () => await prisma.user.findMany(),

    // User: {
    //   balance: () => 22,
    // },

    profile: async (args: { id: UUID }) =>
      await prisma.profile.findUnique({
        where: { id: args.id },
      }),
    profiles: async () => {
      return await prisma.profile.findMany();
    },
  },
});

// export const buildController = (prisma: PrismaClient) => {
//   return ({
//     memberType: async (args: { id: MemberTypeId }) =>
//       await prisma.memberType.findUnique({
//         where: { id: args.id },
//       }),
//     memberTypes: async () => await prisma.memberType.findMany(),

//     post: async (args: { id: UUID }) =>
//       await prisma.post.findUnique({
//         where: { id: args.id },
//       }),
//     posts: async () => await prisma.post.findMany(),

//     // user: async (args: { id: UUID }) => {
//     //   const user = await prisma.user.findUnique({
//     //     where: { id: args.id },
//     //   });
//     //   const profile = await prisma.profile.findUnique({
//     //     where: { userId: user?.id },
//     //   });
//     //   const posts = await prisma.post.findMany({
//     //     where: { authorId: user?.id },
//     //   });
//     //   return {
//     //     ...user,
//     //     profile,
//     //     posts,
//     //   };
//     // },

//     // user: async (args: { id: UUID }) =>
//     //   await prisma.user.findUnique({
//     //     where: { id: args.id },
//     //   }),
//     users: async () => await prisma.user.findMany(),

//     // User: {
//     //   balance: () => 22,
//     // },

//     pro: () => ({
//       name: 'pro',
//     }),

//     profile: async (args: { id: UUID }) =>
//       await prisma.profile.findUnique({
//         where: { id: args.id },
//       }),
//     profiles: async () => {
//       return await prisma.profile.findMany();
//     },
//   });
// };
