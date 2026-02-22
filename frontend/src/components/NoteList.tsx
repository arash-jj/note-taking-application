import React from 'react';
import type { Note } from '@/types/note';

interface NoteListProps {
    notes: Note[];
    selectedNote: Note | null;
    onSelectNote: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({
    notes,
    selectedNote,
    onSelectNote,
    }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };
    if (notes.length === 0) {
        return (
        <div className="p-10 text-center text-gray-500 text-sm">
            No notes yet. Create a new one !
        </div>
        );
    }
    return (
        <div className="flex-1 h-screen space-y-2">
            {notes.map(note => (
                <div
                key={note._id}
                className={`
                    border-b rounded-lg p-3 cursor-pointer transition-all flex flex-col justify-between
                    ${selectedNote?._id === note._id 
                        ? 'bg-[#F4F5F9] border-gray-300'
                        : ' hover:bg-gray-100'
                    }
                `}
                onClick={() => onSelectNote(note)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 truncate flex-1">
                            {note.title.charAt(0).toUpperCase() + note.title.slice(1) || 'Untitled'}
                        </h3>
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        {Array.isArray(note.tags) && note.tags.map((tag: string, index: number) => (
                        <span
                            key={`${tag}-${index}`}
                            className="inline-block bg-gray-200 text-gray-700 text-xs p-1 rounded mr-1 font-semibold"
                        >
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </span>
                        ))}
                    </div>
                    </div>
                    <div className="text-xs text-gray-400">
                        {formatDate(note.updatedAt)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NoteList;