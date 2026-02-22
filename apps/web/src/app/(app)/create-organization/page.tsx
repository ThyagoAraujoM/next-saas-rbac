import Header from '@/src/components/header';
import OrganizationForm from './organization-form';

export default function CreateOrganizationPage() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-300 space-y-4">
        <h1 className="text-2xl font-bold">Create Organization</h1>
        {/* onSubmit={handleSubmit} */}

        <OrganizationForm />
      </main>
    </div>
  );
}
