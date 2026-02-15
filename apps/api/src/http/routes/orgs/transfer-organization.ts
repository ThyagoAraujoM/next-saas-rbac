import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { organizationSchema } from '@saas/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermission } from '@/utils/get-user-permisseions'

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organization/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership to another user',
          security: [{ bearerAuth: [] }],
          body: z.object({
            transferToUserId: z.uuid(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getUserMembership(slug)
        const authOrganization = organizationSchema.parse(organization)
        const { cannot } = getUserPermission(userId, membership.role)

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError('You are not allowed to transfer ownership of this organization')
        }

        const { transferToUserId } = request.body

        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              userId: transferToUserId,
              organizationId: organization.id,
            },
          },
        })

        if (!transferToMembership) {
          throw new BadRequestError('The user you are trying to transfer ownership to is not a member of the organization')
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: { userId: transferToUserId, organizationId: organization.id },
            },
            data: { role: 'ADMIN' },
          }),
          prisma.organization.update({
            where: { id: organization.id },
            data: { ownerId: transferToUserId },
          }),
          prisma.member.update({
            where: {
              organizationId_userId: { userId: userId, organizationId: organization.id },
            },
            data: { role: 'MEMBER' },
          }),
        ])

        reply.status(204).send()
      }
    )
}
