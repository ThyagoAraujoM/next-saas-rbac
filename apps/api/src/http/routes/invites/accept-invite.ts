import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get a new invite',
          params: z.object({
            inviteId: z.uuid(),
          }),
          response: {
            204: z.void(),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params
        const userId = await request.getCurrentUserId()

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })
        if (!invite) {
          throw new BadRequestError('Invite not found')
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (!user) {
          throw new BadRequestError('User not found')
        }

        if (user.email !== invite.email) {
          throw new BadRequestError('This invite belongs to another user')
        }

        await prisma.$transaction([
          prisma.member.create({
            data: {
              userId,
              organizationId: invite.organizationId,
              role: invite.role,
            },
          }),
          prisma.invite.delete({
            where: {
              id: inviteId,
            },
          }),
        ])

        reply.status(204).send()
      }
    )
}
