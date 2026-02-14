import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifyJwt from '@fastify/jwt'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { getProfile } from './routes/auth/get-profile'
import { errorHandler } from './error-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description:
        'Full-stack SaaS boilerplate built with Next.js, Multi-tenant, RBAC, Fastify, Prisma, and more.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

app.listen({ port: 3000 }).then(() => {
  console.log('HTTP server running!')
})
