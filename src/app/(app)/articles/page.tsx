
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search } from "lucide-react";
import type { Article } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArticleForm } from "./article-form";
import { getArticles } from "@/lib/data";

function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    getArticles().then(setArticles);
  }, []);
  return articles;
}

export default function ArticlesPage() {
  const articles = useArticles();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      article.artikel_naam.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Articles">
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new article.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
              <ArticleForm onFinished={() => setCreateDialogOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Short Description</TableHead>
                <TableHead className="text-right">Price (excl. VAT)</TableHead>
                <TableHead className="text-right">VAT</TableHead>
                <TableHead className="text-right">Discount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow
                  key={article.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/articles/${article.id}`)}
                >
                  <TableCell className="font-medium">
                    {article.artikel_naam}
                  </TableCell>
                  <TableCell>
                    {article.artikel_omschrijving_kort}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(article.artikel_prijs_excl_btw)}
                  </TableCell>
                   <TableCell className="text-right">
                    {article.artikel_btw_percentage}%
                  </TableCell>
                   <TableCell className="text-right">
                    {article.artikel_korting_percentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredArticles.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            No articles found.
          </div>
        )}
      </main>
    </div>
  );
}
