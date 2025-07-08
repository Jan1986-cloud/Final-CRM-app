import { getClients, getDocuments } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Download } from "lucide-react";

export default async function DocumentsPage() {
  const clients = await getClients();
  const documents = await getDocuments();

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Documents" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Generate Document</CardTitle>
                <CardDescription>
                  Select a client and document type to generate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="client-select" className="mb-2 block text-sm font-medium">Client</label>
                  <Select>
                    <SelectTrigger id="client-select">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="doc-type-select" className="mb-2 block text-sm font-medium">Document Type</label>
                  <Select>
                    <SelectTrigger id="doc-type-select">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quote">Quote</SelectItem>
                      <SelectItem value="Work Order">Work Order</SelectItem>
                      <SelectItem value="Invoice">Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Generate Document</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.clientName}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{format(new Date(doc.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                           <Badge variant={doc.status === 'Paid' ? 'default' : doc.status === 'Sent' ? 'secondary' : 'outline'}>
                            {doc.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
