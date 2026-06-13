'use server'

import { getCurrentOrg } from '@/src/auth/auth'
import { createOrganization } from '@/src/http/create-organization'
import { updateOrganization } from '@/src/http/update-organization'
import { redirect } from 'next/navigation'
import z from 'zod'
import { revalidateTag } from 'next/cache'

const organizationSchema = z
  .object({
    name: z.string().min(4, { error: 'Name must be at least 4 characters long' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^(?!-)(?:[a-zA-Z0-9-]{1,63}(?<!-)\.)+(?:[a-zA-Z]{2,})$/

            return domainRegex.test(value)
          }
          return true
        },
        { error: 'Invalid domain format' }
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value == true || value == 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is required when attaching users by domain',
      path: ['domain'],
    }
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(_: any, data: FormData) {
  const validationSchema = organizationSchema.safeParse(Object.fromEntries(data))

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

  const { name, domain, shouldAttachUsersByDomain } = validationSchema.data

  try {
    await createOrganization({ name, domain: domain ? domain : null, shouldAttachUsersByDomain })

    revalidateTag('organizations', 'max')
  } catch (error: any) {
    const { message, errors } = await error.response.json()
    return {
      success: false,
      message: message,
      errors: errors,
    }
  }

  return { success: true, message: 'Successfully saved an organization', errors: null }
  redirect('/')
}

export async function updateOrganizationAction(_: any, data: FormData) {
  const currentOrg = await getCurrentOrg()
  const validationSchema = organizationSchema.safeParse(Object.fromEntries(data))

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

  const { name, domain, shouldAttachUsersByDomain } = validationSchema.data

  try {
    await updateOrganization({ org: currentOrg!, name, domain: domain ? domain : null, shouldAttachUsersByDomain })

    revalidateTag('organizations', 'max')
  } catch (error: any) {
    const { message, errors } = await error.response.json()
    return {
      success: false,
      message: message,
      errors: errors,
    }
  }

  return { success: true, message: 'Successfully saved an organization', errors: null }
  redirect('/')
}
