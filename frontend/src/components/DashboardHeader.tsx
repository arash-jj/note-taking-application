import { useLocation } from "react-router-dom";

const DashboardHeader = () => {
    const location = useLocation();
    return (
        <header className="p-2 border-b h-16 flex flex-row items-center justify-between">
            <div>
                <h1 className="text-lg font-bold">{location.pathname === "/dashboard" ? "All Notes" : "Archive"}</h1>
            </div>
            <div className="">
                {/* Todo: add search and settings sections*/}
            </div>
        </header>
    )
}

export default DashboardHeader