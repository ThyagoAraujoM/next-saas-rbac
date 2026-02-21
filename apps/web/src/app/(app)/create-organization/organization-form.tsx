'use client';

import { Checkbox } from '@/src/components/ui/checkbox';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useFormState } from '@/src/hooks/use-form-state';
import { createOrganizationAction } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function OrganizationForm() {
  const { handleSubmit, isPedding, formState } = useFormState({
    action: createOrganizationAction,
    initialState: { success: false, message: null, errors: null },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formState.success === false && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{formState.message}</p>
          </AlertDescription>
        </Alert>
      )}

      {formState.success === true && formState.message && (
        <Alert variant="success">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{formState.message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Oganizarion name</Label>
        <Input name="name" id="name" placeholder="Enter your organization name" />
        {formState.errors?.name && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.name[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input name="domain" type="text" id="domain" placeholder="example.com" inputMode="url" />
        {formState.errors?.domain && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.domain[0]}</p>}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <Checkbox name="shouldAttachUsersByDomain" id="shouldAttachUsersByDomain" />
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-smfont-medium leading-none">Auth-join new members by their e-mail domain</span>
            <p className="text-muted-foreground text-sm">This will automatically invite all members with same e-mail domain to this organization.</p>
          </label>
          {formState.errors?.shouldAttachUsersByDomain && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.shouldAttachUsersByDomain[0]}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {isPedding ? <Loader2 className="size-4 animate-spin" /> : ' Save organization'}
      </Button>
    </form>
  );
}
