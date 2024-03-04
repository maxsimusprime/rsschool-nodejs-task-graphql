import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';
import { buildResolver } from './resolvers.js';
import { buildResolverTest, schemaTest } from './test.js';
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
      // return await graphql({
      //   schema: schemaTest,
      //   source: req.body.query,
      //   variableValues: req.body.variables,
      //   rootValue: buildControllerTest(prisma),
      // });
      return await graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        // rootValue: buildResolver(prisma),
        rootValue: {
          Query: {
            users: async () => [{ id: 'id', name: 'name', balance: 11.22 }],
          },
        },
      });
    },
  });
};

export default plugin;
