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
        body: JSON.stringify(noteData),
    });
    if (!response.ok) {
        let message = 'Failed to create note';
        try {
            const error = await response.json();
            message = error.message || message;
        } catch {
            // Non-JSON error body (e.g. HTML from proxy); fall back to default message
        }
        throw new Error(message);
    }
    return response.json();
};
