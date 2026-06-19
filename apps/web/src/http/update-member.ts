import { Role } from '@saas/auth'
import { api } from './api-client'

interface updateMemberOrganizationRequest {
  org: string
  memberId: string
  role: Role
}

export async function updateMember({ org, memberId, role }: updateMemberOrganizationRequest) {
  await api.put(`organizations/${org}/members/${memberId}`, {
    json: { role },
  })
}
