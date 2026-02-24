'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import githubIcon from '@/src/assets/github-svgrepo-com.svg'
import { signInWithEmailAndPassword } from './actions'
import { Label } from '@/src/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Separator } from '@/src/components/ui/separator'
import { useFormState } from '@/src/hooks/use-form-state'
import { signInWithGithub } from '../actions'

export function SignInForm() {
  const { handleSubmit, isPedding, formState } = useFormState({
    action: signInWithEmailAndPassword,
    initialState: { success: false, message: null, errors: null },
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formState.success === false && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{formState.message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" placeholder="Digite seu e-mail" />
        {formState.errors?.email && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.email}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" placeholder="Digite sua senha" />
        {formState.errors?.password && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.password}</p>}

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

      <Button onClick={signInWithGithub} type="button" variant={'outline'} className="w-full">
        <Image src={githubIcon} className="size-4 dark:invert" alt="" />
        Sign in with GitHub
      </Button>
    </form>
  )
}
