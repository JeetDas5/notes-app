'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Note {
  id: string
  title: string
  preview: string
  timestamp: Date
  isPinned?: boolean
}

interface WorkspaceSidebarProps {
  selectedNoteId?: string
  onSelectNote?: (id: string) => void
  onCreateNote?: () => void
}

export function WorkspaceSidebar({
  selectedNoteId,
  onSelectNote,
  onCreateNote,
}: WorkspaceSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Kickoff',
      preview: 'Discuss goals and timeline for Q2 project...',
      timestamp: new Date(Date.now() - 3600000),
      isPinned: true,
    },
    {
      id: '2',
      title: 'Team Meeting Notes',
      preview: 'Recap of Monday sync with engineering...',
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: 'API Documentation',
      preview: 'Standard endpoints and authentication methods...',
      timestamp: new Date(Date.now() - 172800000),
    },
  ])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedNotes = filteredNotes.filter(n => n.isPinned)
  const unpinnedNotes = filteredNotes.filter(n => !n.isPinned)

  return (
    <div className="flex flex-col h-full bg-card/50 border-r border-border w-64">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Notes</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={onCreateNote}
            className="h-8 w-8 p-0"
          >
            +
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                Pinned
              </p>
              <div className="space-y-1">
                {pinnedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote?.(note.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedNoteId === note.id
                        ? 'bg-accent/10 border border-accent/30'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium text-sm line-clamp-1">{note.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {note.preview}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Notes */}
          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                  All Notes
                </p>
              )}
              <div className="space-y-1">
                {unpinnedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote?.(note.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedNoteId === note.id
                        ? 'bg-accent/10 border border-accent/30'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="font-medium text-sm line-clamp-1">{note.title}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-muted-foreground line-clamp-1 flex-1">
                        {note.preview}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                        {formatTime(note.timestamp)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNotes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-2 text-xs">
        <button className="w-full text-left text-muted-foreground hover:text-foreground transition px-2 py-1">
          Trash
        </button>
        <button className="w-full text-left text-muted-foreground hover:text-foreground transition px-2 py-1">
          Shared with me
        </button>
      </div>
    </div>
  )
}
