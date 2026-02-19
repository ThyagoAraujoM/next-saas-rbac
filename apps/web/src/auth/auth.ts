import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getProfile } from '../http/get-profile'

export async function isAuthenticated() {
  const ck = await cookies()
  return !!ck.get('token')?.value
}

export async function auth() {
  if (!(await isAuthenticated())) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()
    return { user }
  } catch (err) {
    console.log(err)
  }

  redirect('/api/auth/sign-out')
}
