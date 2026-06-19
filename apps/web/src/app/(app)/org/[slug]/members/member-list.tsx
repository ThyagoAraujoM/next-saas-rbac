import { ability, getCurrentOrg } from '@/src/auth/auth'
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar'
import { Button } from '@/src/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/src/components/ui/table'
import { getMembers } from '@/src/http/get-members.ts'
import { getMembership } from '@/src/http/get-membership'
import { getOrganization } from '@/src/http/get-organization'
import { organizationSchema } from '@saas/auth'

import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react'
import Image from 'next/image'
import { removeMemberAction } from './actions'

export async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()
  const [{ membership }, { members }, { organization }] = await Promise.all([getMembership(currentOrg!), getMembers(currentOrg!), getOrganization(currentOrg!)])

  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      <AvatarFallback>
                        {member.avatarUrl && <Image src={member.avatarUrl} width={32} height={32} alt="" className="aspect-square size-full" />}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {member.userId == membership.userId && '(me)'}
                        {member.userId == organization.ownerId && (
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                            <Crown className="size-3" />
                            Owner
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs"> {member.email} </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {permissions?.can('transfer_ownership', authOrganization) && (
                        <Button size="sm" variant="ghost">
                          <ArrowLeftRight />
                          Tranfer ownership
                        </Button>
                      )}
                      {permissions?.can('delete', 'User') && (
                        <form action={removeMemberAction.bind(null, member.id)}>
                          <Button disabled={member.id === membership.id || member.userId == organization.ownerId} type="submit" size="sm" variant="destructive">
                            <UserMinus className="mr-2 size-4" />
                            Remove
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
