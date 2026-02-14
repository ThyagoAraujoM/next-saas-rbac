import type { FastifyInstance } from 'fastify'
import { auth } from '@/http/middlewares/auth'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { roleSchema } from '@saas/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organizations'],
          summary: "Get the current user's membership for an organization",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.uuid(),
                role: roleSchema,
                organizationId: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const { membership } = await request.getUserMembership(slug)

        return reply.status(200).send({
          membership: {
            id: membership.id,
            role: membership.role,
            organizationId: membership.organizationId,
          },
        })
      }
    )
}
