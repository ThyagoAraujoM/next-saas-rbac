'use server'

import { acceptInvite } from '@/src/http/accept-invite'
import { rejectInvite } from '@/src/http/reject-invite'
import { revalidateTag } from 'next/cache'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)
  revalidateTag('organizations', 'max')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}
