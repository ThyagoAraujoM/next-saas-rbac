import { Checkbox } from '@/src/components/ui/checkbox'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'

export default function CreateOrganizationPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Organization</h1>
      {/* onSubmit={handleSubmit} */}
      <form className="space-y-4">
        {/* {formState.success === false && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4"></AlertTriangle>
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{formState.message}</p>
          </AlertDescription>
        </Alert>
      )} */}

        <div className="space-y-1">
          <Label htmlFor="name">Oganizarion name</Label>
          <Input name="name" id="name" placeholder="Enter your organization name" />
          {/* {formState.errors?.name && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.name[0]}</p>} */}
        </div>

        <div className="space-y-1">
          <Label htmlFor="domain">E-mail domain</Label>
          <Input name="domain" type="text" id="domain" placeholder="example.com" inputMode="url" />
          {/* {formState.errors?.email && <p className="text-sm font-medium text-red-500 dark:text-red-400">{formState.errors.email[0]}</p>} */}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox name="shouldAttachUsersByDomain" id="shouldAttachUsersByDomain" />
            <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
              <span className="text-smfont-medium leading-none">Auth-join new members by their e-mail domain</span>
              <p className="text-muted-foreground text-sm">This will automatically invite all members with same e-mail domain to this organization.</p>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save organization
          {/* {isPedding ? <Loader2 className="size-4 animate-spin" /> : 'Create account'} */}
        </Button>
      </form>
    </div>
  )
}
