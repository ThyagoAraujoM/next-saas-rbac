import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Button } from '@/src/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { ArrowRight } from 'lucide-react'

export function ProjectList() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>roject 01</CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, quibusdam molestias. Nam magnam ullam, ex sed vitae aut sint cum deserunt
            repellendus nulla molestias, dignissimos laborum sunt accusantium aliquid veritatis?
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-1.5">
          <Avatar className="size-4">
            <AvatarImage src="https://github.com/diego3g.png" />
            <AvatarFallback />
          </Avatar>

          <span className="text-muted-foreground text-xs">
            Created by <span className="text-foreground font-medium"> Thyago Motta</span> a day ago
          </span>
          <Button size="xs" variant="outline" className="ml-auto p-1">
            View <ArrowRight className="ml-2 size-3" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
