import { api } from './api-client'

interface RevokeInviteRequest {
  inviteId: string
  org: string
}

export async function revokeInvite({ inviteId, org }: RevokeInviteRequest) {
  await api.delete(`organizations/${org}/invites/${inviteId}`)
}
