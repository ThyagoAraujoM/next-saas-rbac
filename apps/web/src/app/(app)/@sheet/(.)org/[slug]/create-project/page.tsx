import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/src/components/ui/sheet'

import { InterceptedSheetContent } from '@/src/components/intercepted-sheet-content'
import ProjectForm from '@/src/app/(app)/org/[slug]/create-project/project-form'

export default function CreateProjectPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent className="">
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <ProjectForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
