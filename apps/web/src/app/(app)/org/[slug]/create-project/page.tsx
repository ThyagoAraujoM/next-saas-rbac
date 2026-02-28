import ProjectForm from './project-form'
import Header from '@/src/components/header'

export default function CreateProjectPage() {
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
