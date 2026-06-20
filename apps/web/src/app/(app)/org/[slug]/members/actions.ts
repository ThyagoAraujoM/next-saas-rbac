'use server'

import { getCurrentOrg } from '@/src/auth/auth'
import { createInvite } from '@/src/http/create-invite'
import { removeMember } from '@/src/http/remove-member'
import { revokeInvite } from '@/src/http/revoke-invite'
import { updateMember } from '@/src/http/update-member'
import { Role, roleSchema } from '@saas/auth'
import { revalidateTag } from 'next/cache'
import z from 'zod'

const inviteSchema = z.object({
  email: z.email({ error: 'Invalid e-mail address' }),
  role: roleSchema,
})

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await removeMember({ org: currentOrg!, memberId })
  revalidateTag(`${currentOrg}/members`, 'max')
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = await getCurrentOrg()

  await updateMember({ org: currentOrg!, memberId, role })
  revalidateTag(`${currentOrg}/members`, 'max')
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = await getCurrentOrg()

  await revokeInvite({
    org: currentOrg!,
    inviteId,
  })
  revalidateTag(`${currentOrg}/invites`, 'max')
}

export async function createInviteAction(_: any, data: FormData) {
  const validationSchema = inviteSchema.safeParse(Object.fromEntries(data))
  const org = (await getCurrentOrg()) as string
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

  const { email, role } = validationSchema.data

  try {
    await createInvite({ org, email, role })
    revalidateTag(`${org}/invites`, 'max')
  } catch (error: any) {
    const { message, errors } = await error.response.json()

    return {
      success: false,
      message: message,
      errors: errors,
    }
  }

  return { success: true, message: 'Successfully saved an invite', errors: null }
}
