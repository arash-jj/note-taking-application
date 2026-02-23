import { useAuth } from '../auth/AuthProvider';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar.tsx'
import { Outlet } from "react-router";
import React, { Suspense } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import NoteList from '@/components/NoteList';
import { useNotes } from '@/hooks/useNotes';
const SimpleEditor = React.lazy(() =>
  import('@/components/tiptap-templates/simple/simple-editor').then((m) => ({
    default: m.SimpleEditor,
  }))
);

export default function Dashboard() {
  const { user, logout } = useAuth();
    const {
    notes,
    selectedNote,
    loading,
    error,
    selectNote,
    createNote,
    updateNote,
    deleteNote
  } = useNotes();
  const editorRef = React.useRef<any>(null)
  const [saving, setSaving] = React.useState(false)
  const handleEditorReady = (ed: any) => {
    editorRef.current = ed
  }
  const handleSave = async () => {
    if (!editorRef.current || !selectedNote) return
    setSaving(true)
    try {
      const content = editorRef.current.getJSON()
      await updateNote(selectedNote._id, { content })
    } catch (e) {
      console.error('Save failed', e)
    } finally {
      setSaving(false)
    }
  }
  const handleCancel = () => {
    if (!editorRef.current || !selectedNote) return
    try {
      editorRef.current.commands.setContent(selectedNote.content)
    } catch (e) {
      console.error('Reset content failed', e)
    }
  }
  return (
    <SidebarProvider>
      <main className='flex flex-row w-full'>
        {/* Sidebar */}
        <AppSidebar />
        <div className="w-full">
          {/* Header */}
          <DashboardHeader />
          <div className="flex flex-row w-full">
            {/* create note col */}
            <section className="w-1/4 h-screen py-3 px-2 flex flex-col items-center gap-4 overflow-y-scroll hide-scrollbar">
              <CreateNoteDialog createNote={createNote} />
              <NoteList 
              notes={notes}
              selectedNote={selectedNote}
              onSelectNote={(note) => {selectNote(note);}}
              />
            </section>
            {/* note editor col */}
            <section className="w-1/2 h-screen overflow-y-auto hide-scrollbar relative border-x border-gray-300">
              {selectedNote ? (
                <>
                <div className="h-6/7">
                  <Suspense fallback={<div className="p-4">Loading editor…</div>}>
                    <SimpleEditor note={selectedNote} onEditorReady={handleEditorReady} />
                  </Suspense>
                </div>
                <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-start gap-2">
                  <button
                    className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving Note…' : 'Save Note'}
                  </button>
                  <button
                    className="text-sm cursor-pointer px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Select a note to view its content</p>
                </div>
              )}
            </section>
            <section className='w-1/4 h-screen'></section>
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
