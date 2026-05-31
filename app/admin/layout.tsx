"use client"

import * as React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronRightIcon,
  SettingsIcon,
  UserIcon,
  ActivityIcon,
  LogOutIcon,
  HomeIcon,
  FileTextIcon,
  InfoIcon,
  PhoneIcon,
} from "lucide-react"
import { AdminHeader } from "./header"
import { ToastProvider } from "@/components/admin/toast-provider"

function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-white font-bold text-sm flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
              <path d="M8 12a4 4 0 1 1 8 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight">eyris</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/admin/homepage" className="flex items-center gap-2 w-full">
                  <HomeIcon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">Trang chủ</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/admin/gioi-thieu" className="flex items-center gap-2 w-full">
                  <InfoIcon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">Giới thiệu</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/admin/lien-he" className="flex items-center gap-2 w-full">
                  <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">Liên hệ</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/admin/posts" className="flex items-center gap-2 w-full">
                  <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">Bài viết</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/admin/settings" className="flex items-center gap-2 w-full">
                  <SettingsIcon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">Cài đặt</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg p-1 hover:bg-accent transition-colors">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-orange-400 text-white text-xs font-medium">AD</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium leading-none truncate">Admin</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">admin@wonmedia.vn</p>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-48">
            <DropdownMenuItem>
              <UserIcon className="h-4 w-4 mr-2" />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ActivityIcon className="h-4 w-4 mr-2" />
              Nhật ký hoạt động
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOutIcon className="h-4 w-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ToastProvider>
  )
}
