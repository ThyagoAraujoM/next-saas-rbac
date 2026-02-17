'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

import githubIcon from '@/assets/github-svgrepo-com.svg'
import { signInWithEmailAndPassword } from './actions'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { useActionState, useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { set } from 'zod'

export function SignInForm() {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })

  const [{ success, message, errors, formData }, formAction, isPedding] = useActionState(signInWithEmailAndPassword, {
    success: false,
    message: null,
    errors: null,
    formData: { email: '', password: '' },
  })

  useEffect(() => {
    if (formData) {
      setFormValues(formData)
    }
  }, [formData])

  return (
    <form action={formAction} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          id="email"
          placeholder="Digite seu e-mail"
        />
        {errors?.email?.errors && <p className="text-sm font-medium text-red-500 dark:text-red-400">{errors.email.errors[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          type="password"
          value={formValues.password}
          onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          id="password"
          placeholder="Digite sua senha"
        />
        {errors?.password?.errors && <p className="text-sm font-medium text-red-500 dark:text-red-400">{errors.password.errors[0]}</p>}

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
