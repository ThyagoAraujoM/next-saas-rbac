import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'

import githubIcon from '@/assets/github-svgrepo-com.svg'

export default function SignInPage() {
  return (
    <form action="" className="space-y-4">
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
        Sign in with e-mail
      </Button>

      <Separator />

      <Button type="submit" variant={'outline'} className="w-full">
        <Image src={githubIcon} className="size-4 dark:invert" alt="" />
        Sign in with GitHub
      </Button>
    </form>
  )
}
