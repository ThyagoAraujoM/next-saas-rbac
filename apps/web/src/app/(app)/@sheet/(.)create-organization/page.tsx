import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/src/components/ui/sheet';
import OrganizationForm from '../../create-organization/organization-form';
import { InterceptedSheetContent } from '@/src/components/intercepted-sheet-content';

export default function CreateOrganizationPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent className="">
        <SheetHeader>
          <SheetTitle>Create Organization</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <OrganizationForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  );
}
