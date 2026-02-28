import { ability, getCurrentOrg } from '@/src/auth/auth'
import ProjectForm from './project-form'
import Header from '@/src/components/header'
import { redirect } from 'next/navigation'

export default async function CreateProjectPage() {
  const permissions = await ability()

  if (permissions?.cannot('create', 'Project')) {
    const org = await getCurrentOrg()
    if (org) redirect(`/org/${org}`)
    redirect('/')
  }

  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-300 space-y-4">
        <h1 className="text-2xl font-bold">Create Project</h1>
        <ProjectForm />
      </main>
    </div>
  )
}
