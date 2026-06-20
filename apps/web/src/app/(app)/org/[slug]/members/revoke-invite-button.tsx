import { Button } from '@/src/components/ui/button'
import { XOctagon } from 'lucide-react'
import { revokeInviteAction } from './actions'

interface RevokeInviteButtonProps {
  inviteId: string
}

export async function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button size="sm" variant="destructive">
        <XOctagon className="mr-2 size-4" />
        Remove invite
      </Button>
    </form>
  )
}
