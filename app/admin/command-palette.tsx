"use client"

import * as React from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  ClockIcon,
  UserPlusIcon,
  PackagePlusIcon,
  MessageSquarePlusIcon,
  FileTextIcon,
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
      <CommandInput placeholder="Search for quick actions & contacts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <ClockIcon className="mr-2 h-4 w-4" />
            <span>Create Task</span>
            <kbd className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">T</kbd>
          </CommandItem>
          <CommandItem>
            <ClockIcon className="mr-2 h-4 w-4" />
            <span>Open Personal Settings</span>
          </CommandItem>
          <CommandItem>
            <UserPlusIcon className="mr-2 h-4 w-4" />
            <span>Add Person</span>
            <kbd className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">⌘3</kbd>
          </CommandItem>
          <CommandItem>
            <PackagePlusIcon className="mr-2 h-4 w-4" />
            <span>Add Product</span>
            <kbd className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">E</kbd>
          </CommandItem>
          <CommandItem>
            <MessageSquarePlusIcon className="mr-2 h-4 w-4" />
            <span>Send Feedback</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Help">
          <CommandItem>
            <FileTextIcon className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="flex items-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <kbd className="bg-muted px-1 rounded">↑</kbd>
          <kbd className="bg-muted px-1 rounded">↓</kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-muted px-1 rounded">↵</kbd>
          Select
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <kbd className="bg-muted px-1 rounded">Esc</kbd>
          Close
        </span>
      </div>
      </Command>
    </CommandDialog>
  )
}
