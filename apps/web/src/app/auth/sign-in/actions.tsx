'use server'

import { signInWithPassword } from '@/src/http/sign-in-with-password'
import { HTTPError } from 'ky'
import z from 'zod'

const signInSchema = z.object({
  email: z.email({ error: 'Please, provide a valid email address' }),
  password: z.string().min(1, { error: 'Please, provide your password' }),
})

export async function signInWithEmailAndPassword(_: any, data: FormData) {
  const validationSchema = signInSchema.safeParse(Object.fromEntries(data))

  if (!validationSchema.success) {
    const treeifiedErrors = z.treeifyError(validationSchema.error)
    const errors = treeifiedErrors.properties
    if (!errors) {
      return { success: false, message: null, errors: null }
    }

    const flattenedErrors = Object.entries(errors).reduce(
      (acc, [key, value]) => {
        acc[key] = value.errors
        return acc
      },
      {} as Record<string, string[]>
    )
    return { success: false, message: null, errors: flattenedErrors }
  }

  const { email, password } = validationSchema.data

  try {
    const token = await signInWithPassword({ email: email, password: password })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }

    console.log(error)

    return { success: false, message: 'Something went wrong', errors: null }
  }

  return { success: true, message: "You're signed in!", errors: null }
}
