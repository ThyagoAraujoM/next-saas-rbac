'use client'

import Link from 'next/link'
import Image from 'next/image'

import githubIcon from '@/src/assets/github-svgrepo-com.svg'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Separator } from '@/src/components/ui/separator'
import { useFormState } from '@/src/hooks/use-form-state'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { signUpAction } from './actions'
import { signInWithGithub } from '../actions'

export default function SignUpForm() {
  const { handleSubmit, isPedding, formState } = useFormState({
    action: signUpAction,
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
        <Label htmlFor="name">Name</Label>
        <Input name="name" id="name" placeholder="Enter your name" />
        {formState.errors?.name && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.name[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" placeholder="Digite seu e-mail" />
        {formState.errors?.email && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.email[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" placeholder="Digite sua senha" />
        {formState.errors?.password && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.password[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input name="password_confirmation" type="password" id="password_confirmation" placeholder="Digite sua senha" />
        {formState.errors?.password_confirmation && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.password_confirmation[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {isPedding ? <Loader2 className="size-4 animate-spin" /> : 'Create account'}
      </Button>

      <Button variant={'link'} className="w-full" size="sm" asChild>
        <Link href={'/auth/sign-in'}>Aready registered? Sign in</Link>
      </Button>

      <Separator />

      <Button onClick={signInWithGithub} type="button" variant={'outline'} className="w-full">
        <Image src={githubIcon} className="size-4 dark:invert" alt="" />
        Sign Up with GitHub
      </Button>
    </form>
  )
}
