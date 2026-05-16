'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface WorkspaceHeaderProps {
  noteTitle?: string
  userEmail?: string
}

export function WorkspaceHeader({
  noteTitle = 'Untitled Note',
  userEmail = 'user@example.com',
}: WorkspaceHeaderProps) {
  const userInitials = userEmail
    .split('@')[0]
    .split('.')
    .map(part => part.charAt(0).toUpperCase())
    .join('')

  return (
    <header className="flex items-center justify-between h-16 border-b border-border px-6 bg-card/50 backdrop-blur-sm">
      {/* Left side - Note title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold truncate">{noteTitle}</h1>
      </div>

      {/* Center - Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="sm">
          Share
        </Button>
        <Button variant="outline" size="sm">
          History
        </Button>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center gap-2 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-muted rounded-lg p-2 transition">
              <Avatar className="h-8 w-8">
                <AvatarImage src={undefined} />
                <AvatarFallback className="text-sm">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm hidden sm:block">{userEmail}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Workspace</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
