import { useAuth } from '../auth/AuthProvider';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar.tsx'
import { Outlet } from "react-router";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <SidebarProvider>
      <main className='flex flex-row gap-2'>
        {/* Sidebar */}
        <AppSidebar />
        <button onClick={logout}>Logout</button>
        <br />
        Dashboard
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
