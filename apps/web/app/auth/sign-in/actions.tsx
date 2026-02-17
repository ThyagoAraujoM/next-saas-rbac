'use server'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'
import z from 'zod'

const signInSchema = z.object({
  email: z.email({ error: 'Please, provide a valid email address' }),
  password: z.string().min(1, { error: 'Please, provide your password' }),
})

export async function signInWithEmailAndPassword(_: any, data: FormData) {
  const validationSchema = signInSchema.safeParse(Object.fromEntries(data))

  if (!validationSchema.success) {
    const errors = z.treeifyError(validationSchema.error)

    return { success: false, message: null, errors: errors.properties }
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

    return { success: false, message: 'Something went wrong', errors: null, formData: { email, password } }
  }

  return { success: true, message: null, errors: null, formData: { email, password } }
}
