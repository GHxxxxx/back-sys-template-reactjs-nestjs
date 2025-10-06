import type { Route } from "./+types/home";
import { AppSidebar } from "../components/app-sidebar"
import { Outlet } from "react-router"
import { Separator } from "../components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "医院管理系统" },
    { name: "description", content: "挂号、分诊、就诊管理系统" },
  ];
}

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {/* 子路由将在这里渲染 */}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
