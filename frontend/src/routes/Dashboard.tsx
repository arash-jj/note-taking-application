import { useAuth } from '../auth/AuthProvider';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar.tsx'
import { Outlet } from "react-router";
import React, { Suspense } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import NoteList from '@/components/NoteList';
import { useNotes } from '@/hooks/useNotes';
import { Clock, Tags, Trash } from 'lucide-react';
const SimpleEditor = React.lazy(() =>
  import('@/components/tiptap-templates/simple/simple-editor').then((m) => ({
    default: m.SimpleEditor,
  }))
);

export default function Dashboard() {
  const { logout } = useAuth();
    const {
    notes,
    selectedNote,
    selectNote,
    createNote,
    updateNote,
    deleteNote
  } = useNotes();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredNotes = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n => {
      const title = n.title || '';
      const content = n.content ? JSON.stringify(n.content) : '';
      return (
        title.toLowerCase().includes(q) ||
        content.toLowerCase().includes(q)
      );
    });
  }, [notes, searchQuery]);

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
        <AppSidebar />
        <div className="w-full">
          <DashboardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLogout={logout}
          />
          <div className="flex flex-row w-full">
            <section className="w-1/4 h-screen py-3 px-2 flex flex-col items-center gap-4 overflow-y-scroll hide-scrollbar">
              <CreateNoteDialog createNote={createNote} />
              <NoteList 
              notes={filteredNotes}
              selectedNote={selectedNote}
              searchQuery={searchQuery}
              onSelectNote={(note) => {selectNote(note);}}
              />
            </section>
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
            <section className='w-1/4 h-screen'>
            {selectedNote && (
              <>
              <div className="p-4">
                  <h1 className="text-xl font-semibold mb-2">{selectedNote.title.charAt(0).toUpperCase() + selectedNote.title.slice(1)}</h1>
                  <div className="flex flex-row items-center gap-3">
                    <Tags size={16} className="inline-block mr-2" />
                    <span className="text-sm text-gray-600">{selectedNote.tags}</span>
                  </div>
                  <div className="flex flex-row items-center gap-3 mt-2">
                    <Clock size={16} className="inline-block mr-2" />
                    <p className="text-sm text-gray-500 leading-1">Last Edited: {new Date(selectedNote.updatedAt).toLocaleDateString()}</p>
                  </div>
              </div>
              <div className="flex flex-col gap-2 p-4 ">
                <button onClick={() => deleteNote(selectedNote._id)} className="text-sm px-4 py-2 rounded border hover:bg-red-600 hover:text-white cursor-pointer">
                  <Trash  size={16} className="inline-block mr-2" />
                  <span>Delete Note</span>
                </button>
              </div>
              </>
            )}
            </section>
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
