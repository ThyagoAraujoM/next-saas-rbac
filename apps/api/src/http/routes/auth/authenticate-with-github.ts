import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import 'dotenv'
import { METHODS } from 'node:http'
import { access } from 'node:fs'
import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { env } from '@saas/env'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/session/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with GitHub',
        body: z.object({
          code: z.string({ error: 'GitHub code is required.' }),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {
      const { code } = request.body

      const accessToken = await exchangeCodeForAccessToken(code)

      const { githubId, avatar_url, name, email } = await fetchGithubUserData(accessToken)

      if (email === null) {
        throw new BadRequestError(
          'Your Github account does not have an email associated to authenticate. Please add an email to your GitHub account and try again.'
        )
      }

      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: { name, email, avatarUrl: avatar_url },
        })
      }

      let userAccount = await prisma.account.findUnique({
        where: {
          provider_userId: { provider: 'GITHUB', userId: user.id },
        },
      })

      if (!userAccount) {
        userAccount = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign({ sub: user.id }, { sign: { expiresIn: '7d' } })

      reply.status(201).send({ token })
    }
  )
}

async function exchangeCodeForAccessToken(code: string): Promise<any> {
  try {
    const githubOAuthUrl = new URL('https://github.com/login/oauth/access_token')

    githubOAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID!)
    githubOAuthUrl.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET!)
    githubOAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_REDIRECT_URI!)

    githubOAuthUrl.searchParams.set('code', code)

    const githubAccessTokenResponse = await fetch(githubOAuthUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
    const githubAccessTokenData = await githubAccessTokenResponse.json()

    const { access_token } = z
      .object({
        access_token: z.string(),
        token_type: z.literal('bearer'),
        scope: z.string(),
      })
      .parse(githubAccessTokenData)

    return access_token
  } catch (error) {
    throw new BadRequestError('Failed to exchange GitHub code for access token. Code expired or invalid.')
  }
}

async function fetchGithubUserData(accessToken: string): Promise<any> {
  try {
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const githubUserData = await githubUserResponse.json()

    const {
      id: githubId,
      avatar_url,
      name,
      email,
    } = z
      .object({
        id: z.number().transform(String),
        avatar_url: z.url(),
        name: z.string().nullable(),
        email: z.email().nullable(),
      })
      .parse(githubUserData)

    return { githubId, avatar_url, name, email }
  } catch (error) {
    throw new BadRequestError('Failed to fetch GitHub user data.')
  }
}
