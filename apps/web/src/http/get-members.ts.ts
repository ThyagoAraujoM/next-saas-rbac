import { api } from './api-client'

interface GetMembersRequest {
  members: {
    id: string
    role: 'ADMIN' | 'MEMBER' | 'BILLING'
    userId: string
    name: string | null
    email: string
    avatarUrl: string | null
  }[]
}

export async function getMembers(org: string) {
  const result = await api.get(`organization/${org}/members`).json<GetMembersRequest>()

  return result
}
