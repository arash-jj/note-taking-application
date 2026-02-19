import { Tag } from "lucide-react";
import { useEffect, useState } from "react";

function TagsSidebar() {
const [tags, setTags] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        fetch("http://localhost:5500/api/tags", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch tags: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => setTags(data))
            .catch((err) => {
                console.error("Error fetching tags:", err);
                setTags([]);
            })
            .finally(() => setLoading(false));
    }, []);
    return (
        <div className="space-y-2 p-1">
            <h3 className="font-semibold text-sm text-gray-700">Tags</h3>
            {loading ? (
                <p>Loading...</p>
            ) : tags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags available</p>
            ) : (
                tags.map((tag: any) => (
                    <button
                        key={tag._id}
                        className="flex justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <Tag size={20} />
                            <p className="text-sm">
                                {tag._id}
                            </p>
                        </div>
                    </button>
                ))
            )}
        </div>
    )
}
export default TagsSidebar