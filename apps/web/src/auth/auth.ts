import { cookies } from 'next/headers'

export async function isAuthenticated() {
  const ck = await cookies()
  return !!ck.get('token')?.value
}
