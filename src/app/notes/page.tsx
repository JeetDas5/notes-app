'use client'

import { useState } from 'react'
import { WorkspaceHeader } from '@/components/workspace-header'
import { WorkspaceSidebar } from '@/components/workspace-sidebar'
import { EditorPanel } from '@/components/editor-panel'
import { AIPanel } from '@/components/ai-panel'

export default function NotesPage() {
  const [selectedNoteId, setSelectedNoteId] = useState<string>('1')
  const [showAIPanel, setShowAIPanel] = useState(true)

  const handleCreateNote = () => {
    console.log('[v0] Creating new note')
    // TODO: Create a new note via your backend API
  }

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id)
    console.log('[v0] Selected note:', id)
  }

  const handleSaveNote = (content: string) => {
    console.log('[v0] Note saved:', content)
    // TODO: Save to backend API
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <WorkspaceHeader
        noteTitle="Project Kickoff"
        userEmail="john@example.com"
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <WorkspaceSidebar
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
        />

        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <EditorPanel
            initialContent="This is your note content. Start typing or use the AI assistant to help format your notes."
            onSave={handleSaveNote}
          />
        </div>

        {/* AI Panel */}
        {showAIPanel && <AIPanel isOpen={showAIPanel} />}
      </div>
    </div>
  )
}
