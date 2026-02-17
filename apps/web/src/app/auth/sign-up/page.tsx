import Link from 'next/link'
import Image from 'next/image'

import githubIcon from '@/src/assets/github-svgrepo-com.svg'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Separator } from '@/src/components/ui/separator'

export default function SignUpPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input name="name" id="name" placeholder="Enter your name" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" placeholder="Digite seu e-mail" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" placeholder="Digite sua senha" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input name="password_confirmation" type="password" id="password_confirmation" placeholder="Digite sua senha" />
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>

      <Button variant={'link'} className="w-full" size="sm" asChild>
        <Link href={'/auth/sign-in'}>Aready registered? Sign in</Link>
      </Button>

      <Separator />

      <Button type="submit" variant={'outline'} className="w-full">
        <Image src={githubIcon} className="size-4 dark:invert" alt="" />
        Sign up with GitHub
      </Button>
    </form>
  )
}
