import Header from '@/src/components/header'
import { auth } from '../../auth/auth'
import { Button } from '../../components/ui/button'

export default async function Home() {
  return (
    <div className="py-4">
      <Header></Header>
    </div>
  )
}
