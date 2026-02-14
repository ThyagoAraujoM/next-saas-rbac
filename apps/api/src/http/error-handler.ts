import { type FastifyInstance } from 'fastify'
import z, { ZodError } from 'zod/v3'
import { BadRequestError } from './routes/_errors/bad-request-error'
import { extractZodError, isFastifyError } from './routes/_errors/helper'
import { UnauthorizedError } from './routes/_errors/unauthorized-error'
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      error: extractZodError(error),
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (isFastifyError(error)) {
    return reply.status(error.statusCode || 500).send({
      message: error,
    })
  }

  console.log('Unexpected error:', error)
  // Send error to some observability service like Sentry, Datadog, etc.

  return reply.status(500).send({
    message: 'Internal server error',
    type: error,
  })
}
