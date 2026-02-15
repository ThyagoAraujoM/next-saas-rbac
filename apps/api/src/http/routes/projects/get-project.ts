import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { createSlug } from '@/utils/create-slug'
import { getUserPermission } from '@/utils/get-user-permisseions'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organization/:orgSlug/projects/:projectSlug',

      {
        schema: {
          tags: ['Projects'],
          summary: 'Get a project details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            201: z.object({
              project: z.object({
                id: z.uuid(),
                name: z.string(),
                description: z.string(),
                slug: z.string(),
                ownerId: z.uuid(),
                avatarUrl: z.url().nullable(),
                organizationId: z.uuid(),
                owner: z.object({
                  id: z.uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getUserMembership(orgSlug)

        const { cannot } = getUserPermission(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new BadRequestError(`You're not allowed to view this project`)
        }

        const project = await prisma.project.findUnique({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
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
            slug: projectSlug,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found')
        }

        return reply.status(201).send({ project })
      }
    )
}
