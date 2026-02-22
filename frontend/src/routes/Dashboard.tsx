import { useAuth } from '../auth/AuthProvider';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar.tsx'
import { Outlet } from "react-router";
import DashboardHeader from '@/components/DashboardHeader';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import NoteList from '@/components/NoteList';
import { useNotes } from '@/hooks/useNotes';

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
            <section className="w-1/4 h-screen py-3 px-2 flex flex-col items-center gap-4 border-r border-gray-300 overflow-y-scroll hide-scrollbar">
              <CreateNoteDialog />
              <NoteList 
              notes={notes}
              selectedNote={selectedNote}
              onSelectNote={(note) => {selectNote(note);}}
              />
            </section>
            <button onClick={logout}>Logout</button>
            <br />
            Dashboard
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
