import Image from 'next/image'
import Logo from '../assets/logo.svg'
import { ProfileButton } from './profile-button'
import { OrganizationSwitcher } from './organization-switcher'
import { Slash } from 'lucide-react'
import Link from 'next/link'
import { ability } from '../auth/auth'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme/theme.switcher'
import ProjectSwitcher from './project-switcher'

export default async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto flex max-w-300 items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href={'/'}>
          <Image src={Logo} alt="Logo" className="size-6" />
        </Link>
        <Slash className="text-border size-3 -rotate-24" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="text-border size-3 -rotate-24" />
            <ProjectSwitcher />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
