'use client'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { AlertTriangle, Loader2, UserPlus } from 'lucide-react'
import { createInviteAction } from './actions'
import { useFormState } from '@/src/hooks/use-form-state'

export function CreateInviteForm() {
  const { handleSubmit, isPedding, formState } = useFormState({
    action: createInviteAction,
    initialState: { success: false, message: null, errors: null },
    onSuccess: async () => {},
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formState.success === false && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Invite failed!</AlertTitle>
          <AlertDescription>
            <p>{formState.message}</p>
          </AlertDescription>
        </Alert>
      )}

      {formState.success === true && formState.message && (
        <Alert variant="success">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Save project success!</AlertTitle>
          <AlertDescription>
            <p>{formState.message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <div className="flex flex-1 space-y-1">
          <Input name="email" id="email" type="email" placeholder="jonh@example.com" />
          {formState.errors?.email && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.email}</p>}
        </div>

        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          {isPedding ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Invite User
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
