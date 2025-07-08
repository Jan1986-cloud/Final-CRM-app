import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { BookUser } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 font-headline font-semibold text-lg">
            <BookUser className="h-6 w-6 shrink-0 text-primary" />
            <span className="group-data-[collapsible=icon]:hidden">Final CRM</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
