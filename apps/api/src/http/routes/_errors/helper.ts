import { ZodError } from 'zod'

export function isFastifyError(
  error: unknown
): error is { code: string; statusCode?: number; message: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as any).code === 'string' &&
    (error as any).code.startsWith('FST_')
  )
}

export function extractZodError(error: any): ZodError | null {
  const errors = error.validation.map((err: any) => {
    // Extrai o nome do campo do instancePath (ex: "/email" -> "email")
    const field = err.instancePath.replace('/', '')

    return { [field]: err.message }
  })

  return errors
}
