import { ability, getCurrentOrg } from '@/src/auth/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { getOrganization } from '@/src/http/get-organization'
import OrganizationForm from '../../organization-form'
import ShutdownOrganizationButton from './shutdown-organization-button'

export default async function Settings() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

  const { organization } = await getOrganization(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Update your organization details</CardDescription>
            </CardHeader>

            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={{ name: organization.name, domain: organization.domain, shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain, }}
              ></OrganizationForm>
            </CardContent>
          </Card>
        )}
        {canGetBilling && <h1 className="text-2xl font-bold">Billing</h1>}

        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Shutdown organization</CardTitle>
              <CardDescription>This will delete all organization data including all projects. You cannot undo this action.</CardDescription>
            </CardHeader>

            <CardContent>
              <ShutdownOrganizationButton></ShutdownOrganizationButton>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
