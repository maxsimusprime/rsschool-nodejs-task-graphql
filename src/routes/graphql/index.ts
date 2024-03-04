import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';
import { buildResolver } from './resolvers.js';
import { buildResolverTest, schemaTest, resolverTest } from './test.js';
// import depthLimit from 'graphql-depth-limit'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        // rootValue: buildResolver(prisma),
        contextValue: { prisma },
      });
    },
  });

  fastify.route({
    url: '/test',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      return await graphql({
        schema: schemaTest,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
