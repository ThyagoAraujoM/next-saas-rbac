import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/src/components/ui/sheet';
import OrganizationForm from '../../create-organization/organization-form';

export default function CreateOrganizationPage() {
  return (
    <Sheet defaultOpen>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Create Organization</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <OrganizationForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
