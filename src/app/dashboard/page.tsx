'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DashboardPage() {
  const recentNotes = [
    {
      id: '1',
      title: 'Project Kickoff',
      preview: 'Discuss goals and timeline for Q2 project...',
      lastModified: new Date(Date.now() - 3600000),
      collaborators: 3,
    },
    {
      id: '2',
      title: 'Team Meeting Notes',
      preview: 'Recap of Monday sync with engineering...',
      lastModified: new Date(Date.now() - 86400000),
      collaborators: 2,
    },
    {
      id: '3',
      title: 'API Documentation',
      preview: 'Standard endpoints and authentication methods...',
      lastModified: new Date(Date.now() - 172800000),
      collaborators: 1,
    },
  ]

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, John</p>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/notes">Create Note</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Notes</div>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-2">2 more than last week</p>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Collaborators</div>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-2">Active team members</p>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">This Week</div>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-2">Notes edited</p>
          </Card>
        </div>

        {/* Recent Notes */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Recent Notes</h2>
          <div className="grid gap-4">
            {recentNotes.map(note => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block group"
              >
                <Card className="p-6 hover:bg-card/80 hover:border-accent/50 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-accent transition">
                        {note.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {note.preview}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(note.lastModified)}
                    </span>
                    <div className="flex -space-x-2">
                      {Array.from({ length: Math.min(note.collaborators, 3) }).map((_, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs">{String.fromCharCode(65 + i)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {note.collaborators > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{note.collaborators - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
