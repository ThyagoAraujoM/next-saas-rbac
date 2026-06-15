import { getCurrentOrg } from '@/src/auth/auth'
import { createProject } from '@/src/http/create-project'
import { getBilling } from '@/src/http/get-billing'

import { Separator } from '@/src/components/ui/separator'
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from '@/src/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'

export async function Billing() {
  const currentOrg = await getCurrentOrg()
  const { billing } = await getBilling(currentOrg!)

  return (
    <>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Information about your organization costs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost type</TableHead>
                <TableHead className="text-right" style={{ width: 120 }}>
                  Quantity
                </TableHead>
                <TableHead className="text-right" style={{ width: 200 }}>
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Amout of projects</TableCell>
                <TableCell className="text-right">{billing.projects.ammount}</TableCell>
                <TableCell className="text-right">
                  {billing.projects.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}{' '}
                  (
                  {billing.projects.unit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}{' '}
                  each)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amout of seats</TableCell>
                <TableCell className="text-right">{billing.seats.ammount}</TableCell>
                <TableCell className="text-right">
                  {billing.seats.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}{' '}
                  (
                  {billing.seats.unit.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}{' '}
                  each)
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell className="text-right">Total</TableCell>
                <TableCell className="text-right">
                  {billing.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
