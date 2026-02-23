import { useLocation } from "react-router-dom";
import type { ChangeEvent } from "react";

interface DashboardHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ searchQuery, onSearchChange, onLogout }) => {
    const location = useLocation();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    return (
        <header className="px-2 border-b h-16 flex flex-row items-center justify-between">
            <div>
                <h1 className="text-lg font-bold">
                    {location.pathname === "/dashboard" ? "All Notes" : "Archive"}
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={handleChange}
                    className="px-2 py-1 border rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={onLogout}
                    className="text-sm px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader