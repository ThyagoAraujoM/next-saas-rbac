import { api } from './api-client'

interface removeMemberOrganizationRequest {
  org: string
  memberId: string
}

export async function removeMember({ org, memberId }: removeMemberOrganizationRequest) {
  await api.delete(`organizations/${org}/members/${memberId}`)
}
