'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Loader2 } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

import githubIcon from '@/assets/github-svgrepo-com.svg'
import { signInWithEmailAndPassword } from './actions'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { useActionState } from 'react'

export function SignInForm() {
  const [state, formAction, isPedding] = useActionState(signInWithEmailAndPassword, null)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" placeholder="Digite seu e-mail" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" placeholder="Digite sua senha" />

        <Link href={'/auth/forgot-password'} className="hover:underling text-foreground text-xs font-medium">
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        {isPedding ? <Loader2 className="size-4 animate-spin" /> : 'Sign in with e-mail'}
      </Button>

      <Button variant={'link'} className="w-full" size="sm" asChild>
        <Link href={'/auth/sign-up'}>Create new account</Link>
      </Button>

      <Separator />

      <Button type="submit" variant={'outline'} className="w-full">
        <Image src={githubIcon} className="size-4 dark:invert" alt="" />
        Sign in with GitHub
      </Button>
    </form>
  )
}
