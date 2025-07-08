import { getClientById, getDocumentById } from "@/lib/data";
import { notFound } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FilePlus2 } from "lucide-react";

export default async function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const doc = await getDocumentById(params.id);
  if (!doc) {
    notFound();
  }

  const client = await getClientById(doc.klant_id);

  const badgeVariant = {
    Paid: "default",
    Sent: "secondary",
    Draft: "outline",
    concept: "outline",
  }[doc.document_status] as "default" | "secondary" | "outline";


  return (
    <div className="flex h-full flex-col">
      <PageHeader title={`Document ${doc.document_nummer}`} />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-3xl font-bold">{doc.document_type}</CardTitle>
                    <CardDescription className="pt-2">
                        For: {client?.name ?? 'N/A'}
                    </CardDescription>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg">{doc.document_nummer}</p>
                    <p className="text-sm text-muted-foreground">
                        Date: {format(new Date(doc.document_datum), "PPP")}
                    </p>
                    <div className="mt-2">
                        <Badge variant={badgeVariant}>
                            {doc.document_status}
                        </Badge>
                    </div>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="my-6" />

            <div className="min-h-[200px] rounded-lg border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center p-8">
                <FilePlus2 className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Line Items</h3>
                <p className="text-muted-foreground mt-1">
                    Get started by adding the first line item to this document.
                </p>
                <Button className="mt-4">Add Line Item</Button>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <div className="grid w-full max-w-sm gap-2 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(doc.totaal_subtotaal_excl_btw)}</span>
                </div>
                 <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">VAT</span>
                  <span>{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(doc.totaal_btw_bedrag)}</span>
                </div>
                 <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(doc.totaal_incl_btw)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex w-full justify-end gap-2">
                <Button variant="outline">Download PDF</Button>
                <Button>Send Document</Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
