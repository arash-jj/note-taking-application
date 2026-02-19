import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Archive, ChevronRight, House } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom";
import TagsSidebar from "./TagsSidebar";

export function AppSidebar() {
    const location = useLocation();
    return (
        <Sidebar className="p-2">
            <SidebarHeader className="bg-white border-b">
                <div className="flex flex-col gap-5">
                    <img src="/logo.svg" alt="logo" width={100} height={50} />
                    <div className="hover:bg-secondary rounded-2xl">
                        <NavLink className="flex flex-row gap-2 items-center rounded-2xl p-2" to="/dashboard">
                            <House size={20} className={location.pathname === "/dashboard" ? "text-blue-500" : "text-muted-foreground"}/>
                            All Notes
                            <ChevronRight size={20} className={`ml-auto ${location.pathname !== "/dashboard" ? "visible" : "invisible"}`} />
                        </NavLink>
                    </div>
                    <div className="hover:bg-secondary rounded-2xl">
                        <NavLink className="flex flex-row gap-2 items-center rounded-2xl p-2" to="/dashboard/archive">
                            <Archive size={20} className={location.pathname === "/dashboard/archive" ? "text-blue-500" : "text-muted-foreground"} />
                            Archive
                            <ChevronRight size={20} className={`ml-auto ${location.pathname !== "/dashboard/archive" ? "visible" : "invisible"}`} />
                        </NavLink>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <TagsSidebar />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}