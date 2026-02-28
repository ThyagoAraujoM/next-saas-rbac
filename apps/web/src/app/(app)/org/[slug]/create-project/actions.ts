'use server'

import { getCurrentOrg } from '@/src/auth/auth'
import { createProject } from '@/src/http/create-project'
import { redirect } from 'next/navigation'
import z from 'zod'

const projectSchema = z.object({
  name: z.string().min(4, { error: 'Name must be at least 4 characters long' }),
  description: z.string(),
})

export async function createProjectAction(_: any, data: FormData) {
  const validationSchema = projectSchema.safeParse(Object.fromEntries(data))

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

  const { name, description } = validationSchema.data

  try {
    await createProject({ org: (await getCurrentOrg()) as string, name, description })
  } catch (error: any) {
    const { message, errors } = await error.response.json()
    console.log(message, errors)
    return {
      success: false,
      message: message,
      errors: errors,
    }
  }

  return { success: true, message: 'Successfully saved an project', errors: null }
  redirect('/')
}
