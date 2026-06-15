import { api } from './api-client'

interface getBillingResponse {
  billing: {
    seats: {
      ammount: number
      unit: number
      price: number
    }
    projects: {
      ammount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(org: string) {
  const result = await api.get(`organizations/${org}/billing`).json<getBillingResponse>()
  return result
}
