import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUserPermission } from '@/utils/get-user-permisseions'
import { roleSchema } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function updateMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.void(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getUserMembership(slug)

        const { cannot } = getUserPermission(userId, membership.role)
        if (cannot('update', 'User')) {
          throw new UnauthorizedError(`You're not allowed to update this member`)
        }

        const member = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              userId: memberId,
              organizationId: organization.id,
            },
          },
        })

        if (!member) {
          throw new BadRequestError(`Member not found`)
        }

        const { role } = request.body

        await prisma.member.update({
          where: {
            organizationId_userId: {
              userId: memberId,
              organizationId: organization.id,
            },
          },
          data: {
            role: role,
          },
        })

        return reply.status(204).send()
      }
    )
}
