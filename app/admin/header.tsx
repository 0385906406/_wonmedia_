"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  SearchIcon,
  BellIcon,
  SettingsIcon,
  CheckIcon,
  DownloadIcon,
  CalendarIcon,
} from "lucide-react"
import { CommandPalette } from "./command-palette"
import { PageBreadcrumb } from "@/components/admin/page-breadcrumb"

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "es", label: "Espanol", flag: "🇪🇸" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
]

const notifications = [
  {
    id: 1,
    user: "Katelyn",
    action: "shared a file in",
    project: "Orbital",
    projectColor: "bg-purple-500",
    time: "a year ago",
    type: "file",
    fileName: "Team_banner_inspo.jpg",
    fileSize: "996 KB",
  },
  {
    id: 2,
    user: "Zander",
    action: "commented in",
    project: "Trackline",
    projectColor: "bg-red-500",
    time: "a year ago",
    type: "comment",
    comment: "I think these schedule times will need to update to the users' timezone automatically. Alternatively, sho...",
  },
  {
    id: 3,
    user: "Marcus",
    action: "requested access to",
    project: "Voltstream",
    projectColor: "bg-blue-500",
    time: "a year ago",
    type: "access",
  },
  {
    id: 4,
    user: "Fiona",
    action: "shared a file in",
    project: "Voltstream",
    projectColor: "bg-blue-500",
    time: "a year ago",
    type: "file",
    fileName: "Customer_Data_Q12025.csv",
    fileSize: "2 MB",
  },
  {
    id: 5,
    user: "Nora Whitfield",
    action: "invited you to",
    project: "Release Prep Meeting",
    projectColor: "bg-gray-400",
    time: "a year ago",
    type: "calendar",
    event: { day: "Sun 13", title: "Release Prep Meeting", time: "4:00 AM - 5:00 AM" },
  },
  {
    id: 6,
    user: "Elena Cruz",
    action: "assigned you to",
    project: "Component Review",
    projectColor: "bg-gray-400",
    time: "a year ago",
    type: "task",
  },
]

const avatarColors: Record<string, string> = {
  Katelyn: "bg-slate-400",
  Zander: "bg-amber-500",
  Marcus: "bg-blue-400",
  Fiona: "bg-rose-400",
  "Nora Whitfield": "bg-purple-400",
  "Elena Cruz": "bg-green-400",
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

function NotificationItem({ notif }: { notif: typeof notifications[0] }) {
  return (
    <div className="flex gap-3 py-4 border-b last:border-b-0">
      <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5">
        <AvatarFallback className={`${avatarColors[notif.user] ?? "bg-gray-400"} text-white text-xs`}>
          {getInitials(notif.user)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm leading-snug">
          <span className="font-medium">{notif.user}</span>{" "}
          <span className="text-muted-foreground">{notif.action}</span>{" "}
          <Badge variant="outline" className="text-xs gap-1 px-1.5 py-0 h-5">
            <span className={`inline-block w-2 h-2 rounded-full ${notif.projectColor}`} />
            {notif.project}
          </Badge>
        </p>
        <p className="text-xs text-muted-foreground">{notif.time}</p>

        {notif.type === "file" && notif.fileName && (
          <div className="flex items-center justify-between rounded-lg border p-2 bg-muted/40 text-xs mt-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100 text-green-600 text-[10px] font-bold">
                {notif.fileName.endsWith(".csv") ? "CSV" : "IMG"}
              </div>
              <div>
                <p className="font-medium text-foreground">{notif.fileName}</p>
                <p className="text-muted-foreground">{notif.fileSize}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <DownloadIcon className="h-3 w-3" />
            </Button>
          </div>
        )}

        {notif.type === "comment" && notif.comment && (
          <div className="rounded-lg border p-2 bg-muted/40 text-xs mt-1 text-muted-foreground">
            {notif.comment}
          </div>
        )}

        {notif.type === "access" && (
          <div className="flex gap-2 mt-1">
            <Button variant="outline" size="sm" className="h-7 text-xs">Decline</Button>
            <Button size="sm" className="h-7 text-xs">Accept</Button>
          </div>
        )}

        {notif.type === "calendar" && notif.event && (
          <div className="flex items-center gap-2 rounded-lg border p-2 bg-muted/40 text-xs mt-1">
            <div className="flex h-10 w-10 flex-col items-center justify-center rounded border flex-shrink-0 bg-background">
              <span className="text-[9px] text-muted-foreground">{notif.event.day.split(" ")[0]}</span>
              <span className="text-base font-bold leading-none">{notif.event.day.split(" ")[1]}</span>
            </div>
            <div>
              <p className="font-medium text-foreground">{notif.event.title}</p>
              <p className="text-muted-foreground">{notif.event.time}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function AdminHeader() {
  const [lang, setLang] = React.useState(languages[0])
  const [notifOpen, setNotifOpen] = React.useState(false)
  const [cmdOpen, setCmdOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCmdOpen(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 mx-1" />
        <PageBreadcrumb />

        <div className="flex-1" />

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setCmdOpen(true)}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent className="w-[420px] sm:max-w-[420px] p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-0">
            <SheetTitle className="text-lg font-semibold">Thông báo</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-6 mt-3 grid grid-cols-3 h-9">
              <TabsTrigger value="general" className="text-sm">Tất cả</TabsTrigger>
              <TabsTrigger value="mentions" className="text-sm">Đề cập</TabsTrigger>
              <TabsTrigger value="archive" className="text-sm">Lưu trữ</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="flex-1 overflow-y-auto px-6 mt-0 py-2">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notif={n} />
              ))}
            </TabsContent>
            <TabsContent value="mentions" className="px-6 py-8 text-center text-sm text-muted-foreground">
              Chưa có đề cập nào.
            </TabsContent>
            <TabsContent value="archive" className="px-6 py-8 text-center text-sm text-muted-foreground">
              Lưu trữ trống.
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
            <Button variant="outline" size="sm">Đánh dấu đã đọc</Button>
            <Button size="sm">Xem tất cả</Button>
          </div>
        </SheetContent>
      </Sheet>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  )
}
