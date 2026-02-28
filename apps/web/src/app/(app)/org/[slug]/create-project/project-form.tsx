'use client'

import { Checkbox } from '@/src/components/ui/checkbox'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { useFormState } from '@/src/hooks/use-form-state'

import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { createProjectAction } from './actions'
import { Textarea } from '@/src/components/ui/textarea'
import { useParams } from 'next/navigation'
import { queryClient } from '@/src/lib/react-query'

export default function ProjectForm() {
  const { slug: org } = useParams<{ slug: string }>()

  const { handleSubmit, isPedding, formState } = useFormState({
    action: createProjectAction,
    initialState: { success: false, message: null, errors: null },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [org, 'projects'],
      })
    },
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formState.success === false && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Save project in failed!</AlertTitle>
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

      <div className="space-y-1">
        <Label htmlFor="name">Project name</Label>
        <Input name="name" id="name" placeholder="Enter your project name" />
        {formState.errors?.name && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.name}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Project Description</Label>
        <Textarea name="description" id="description" placeholder="Enter your project description" />
        {formState.errors?.description && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.description}</p>}
      </div>

      <Button type="submit" className="w-full">
        {isPedding ? <Loader2 className="size-4 animate-spin" /> : ' Save project'}
      </Button>
    </form>
  )
}
