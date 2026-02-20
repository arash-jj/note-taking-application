const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';

export interface CreateNotePayload {
    title: string;
    content?: string;
    tags?: string;
}

export interface NoteResponse {
    id: string;
    title: string;
    content?: string;
    tags?: string;
    createdAt: string;
    updatedAt: string;
}

export const createNote = async (noteData: CreateNotePayload): Promise<NoteResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(noteData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create note');
    }
    return response.json();
};
