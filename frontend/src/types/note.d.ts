export interface Note {
    _id: string;
    title: string;
    content: any; // TipTap JSON content
    tags: any; // Assuming tag is an array of strings or a string, adjust as needed
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNotePayload {
    title: string;
    content: any;
    tags: any;
}

export interface UpdateNotePayload {
    title?: string;
    content?: any;
}

export interface NoteResponse {
    _id: string;
    title: string;
    content: any;
    userId?: string;
    createdAt: string;
    updatedAt: string;
    message?: string;
}

export interface NotesContextType {
    notes: Note[];
    selectedNote: Note | null;
    loading: boolean;
    error: string | null;
    fetchNotes: () => Promise<void>;
    fetchNoteById: (id: string) => Promise<Note>;
    selectNote: (note: Note | null) => void;
    selectNoteById: (id: string) => Promise<void>;
    createNote: (noteData?: Partial<CreateNotePayload>) => Promise<Note>;
    updateNote: (id: string, updates: Partial<UpdateNotePayload>) => Promise<Note>;
    deleteNote: (id: string) => Promise<void>;
}