import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z, { email } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { hash } from 'bcryptjs'

export async function ResetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Reset password',
        body: z.object({
          code: z.string({ error: 'Code is required.' }).uuid(),
          newPassword: z.string({ error: 'New password is required.' }).min(6, {
            error: 'New password must be at least 6 characters long.',
          }),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, newPassword } = request.body

      const tokenFromCode = await prisma.token.findUnique({
        where: { id: code, type: 'PASSWORD_RECOVER' },
      })

      if (!tokenFromCode) {
        throw new UnauthorizedError('Invalid token')
      }

      const passwordHash = await hash(newPassword, 6)

      await prisma.user.update({
        where: { id: tokenFromCode.userId },
        data: { passwordHash },
      })

      return reply.status(204).send(null)
    }
  )
}
