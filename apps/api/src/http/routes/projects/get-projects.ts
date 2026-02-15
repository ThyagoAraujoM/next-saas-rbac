import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { getUserPermission } from '@/utils/get-user-permisseions'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:orgSlug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get all projects in an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            201: z.object({
              projects: z.array(
                z.object({
                  id: z.uuid(),
                  name: z.string(),
                  description: z.string(),
                  slug: z.string(),
                  ownerId: z.uuid(),
                  avatarUrl: z.url().nullable(),
                  organizationId: z.uuid(),
                  createdAt: z.date(),
                  owner: z.object({
                    id: z.uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().nullable(),
                  }),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermission(userId, membership.role)
        if (cannot('get', 'Project')) {
          throw new BadRequestError(`You're not allowed to see the projects in this organization`)
        }

        const projects = await prisma.project.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.status(201).send({ projects })
      }
    )
}
