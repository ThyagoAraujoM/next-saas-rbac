import { signInWithGithub } from '@/src/http/sign-in-with-github'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ message: 'Github OAuth code was not found' }, { status: 400 })
  }

  const token = await signInWithGithub({ code })

  const cookie = await cookies()
  cookie.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, //7 days
  })

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.searchParams.delete('code')

  return NextResponse.redirect(redirectUrl)
}
