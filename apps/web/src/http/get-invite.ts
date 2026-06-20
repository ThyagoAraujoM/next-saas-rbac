import { Role } from '@saas/auth'
import { api } from './api-client'

interface getInviteResponse {
  invite: {
    role: Role
    id: string
    email: string
    createdAt: string
    organization: {
      name: string
    }
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }
}

export async function getInvite(inviteId: string) {
  const result = await api.get(`invites/${inviteId}`).json<getInviteResponse>()

  return result
}
