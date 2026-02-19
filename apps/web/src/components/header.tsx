import Image from 'next/image'
import Logo from '../assets/logo.svg'
import { ProfileButton } from './profile-button'

export default async function Header() {
  return (
    <div className="mx-auto flex max-w-300 items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={Logo} alt="Logo" className="size-6" />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton></ProfileButton>
      </div>
    </div>
  )
}
