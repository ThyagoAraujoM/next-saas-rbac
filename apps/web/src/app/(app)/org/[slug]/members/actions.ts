'use server'

import { getCurrentOrg } from '@/src/auth/auth'
import { removeMember } from '@/src/http/remove-member'
import { revalidateTag } from 'next/cache'

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await removeMember({ org: currentOrg!, memberId })
  revalidateTag(`${currentOrg}/members`, 'max')
}
