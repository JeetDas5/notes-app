'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface EditorPanelProps {
  initialContent?: string
  onSave?: (content: string) => void
}

export function EditorPanel({
  initialContent = '',
  onSave,
}: EditorPanelProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Call your backend API to save the note
    console.log('[v0] Saving note:', content)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      onSave?.(content)
    }, 500)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">B</Button>
          <Button size="sm" variant="outline">I</Button>
          <Button size="sm" variant="outline">U</Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button size="sm" variant="outline">📝</Button>
          <Button size="sm" variant="outline">🤖 AI Format</Button>
        </div>
        <Button
          size="sm"
          className="bg-accent hover:bg-accent/90"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden flex flex-col p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note..."
          className="flex-1 resize-none font-mono text-sm p-4 border-0 focus:outline-none"
        />
      </div>
    </div>
  )
}
