import { useAuth } from '../auth/AuthProvider';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar.tsx'
import { Outlet } from "react-router";
import DashboardHeader from '@/components/DashboardHeader';
import CreateNoteDialog from '@/components/CreateNoteDialog';

export default function Dashboard() {
  const { user, logout } = useAuth();
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
            <section className="w-1/4 p-4 flex flex-col items-center gap-4 border-r border-gray-300">
              <CreateNoteDialog />
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
