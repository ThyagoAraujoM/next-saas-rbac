'use server'

import { getCurrentOrg } from '@/src/auth/auth'
import { removeMember } from '@/src/http/remove-member'
import { revokeInvite } from '@/src/http/revoke-invite'
import { updateMember } from '@/src/http/update-member'
import { Role } from '@saas/auth'
import { revalidateTag } from 'next/cache'

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
