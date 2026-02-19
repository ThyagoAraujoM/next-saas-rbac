'use server'

import { signUp } from '@/src/http/sign-up'
import { redirect } from 'next/navigation'
import z from 'zod'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, { error: 'Please, provide your name' }),
    email: z.email({ error: 'Please, provide a valid email address' }),
    password: z.string().min(6, { error: 'Please, password must be at least 6 characters' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    error: "Passwords don't match",
    path: ['password_confirmation'],
  })

export async function signUpAction(_: any, data: FormData) {
  const validationSchema = signUpSchema.safeParse(Object.fromEntries(data))

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
    console.log(flattenedErrors)
    return { success: false, message: null, errors: flattenedErrors }
  }

  const { name, email, password } = validationSchema.data

  try {
    await signUp({ email, password, name })
  } catch (error) {
    console.log(error)

    return { success: false, message: 'Something went wrong', errors: null }
  }

  redirect('/auth/sign-in')
}
