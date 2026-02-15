import type { FastifyInstance } from 'fastify'
import { auth } from '@/http/middlewares/auth'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getUserPermission } from '@/utils/get-user-permisseions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export async function getOrganizationBilling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          tags: ['Billing'],
          summary: 'Get billing information of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  ammount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  ammount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getUserMembership(slug)

        const { cannot } = getUserPermission(userId, membership.role)
        if (cannot('get', 'Billing')) {
          throw new UnauthorizedError('You do not have permission to get billing information')
        }

        const [ammountOfMembers, ammountOfProjects] = await Promise.all([
          prisma.member.count({
            where: {
              organizationId: organization.id,
              role: { not: 'BILLING' },
            },
          }),

          prisma.project.count({
            where: {
              organizationId: organization.id,
            },
          }),
        ])

        return reply.status(200).send({
          billing: {
            seats: {
              ammount: ammountOfMembers,
              unit: 10,
              price: ammountOfMembers * 10,
            },
            projects: {
              ammount: ammountOfProjects,
              unit: 20,
              price: ammountOfProjects * 20,
            },
            total: ammountOfMembers * 10 + ammountOfProjects * 20,
          },
        })
      }
    )
}
