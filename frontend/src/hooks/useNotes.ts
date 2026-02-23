import { useState, useEffect, useCallback } from 'react';
import type { Note, CreateNotePayload, UpdateNotePayload, NoteResponse } from '../types/note'; 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let message = 'Request failed';
        try {
        const error = await response.json();
        message = error.message || message;
        } catch {
        }
        throw new Error(message);
    }
    return response.json();
};

export const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/notes`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            
            const data = await handleResponse<Note[]>(response);
            
            const parsedData = data.map(note => {
                try {
                    return {
                        ...note,
                        content: typeof note.content === 'string' && note.content 
                            ? JSON.parse(note.content) 
                            : note.content
                    };
                } catch {
                    return {
                        ...note,
                        content: note.content || { type: 'doc', content: [{ type: 'paragraph' }] }
                    };
                }
            });
            
            setNotes(parsedData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error fetching notes');
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    }, []);
    
    const fetchNoteById = useCallback(async (id: string): Promise<Note> => {
        const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        
        const note = await handleResponse<Note>(response);
        
        try {
            return {
                ...note,
                content: typeof note.content === 'string' && note.content 
                    ? JSON.parse(note.content) 
                    : note.content
            };
        } catch {
            return {
                ...note,
                content: note.content || { type: 'doc', content: [{ type: 'paragraph' }] }
            };
        }
    }, []);
    
    const selectNote = useCallback((note: Note | null) => {
        setSelectedNote(note);
    }, []);
    
    const selectNoteById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const note = await fetchNoteById(id);
            setSelectedNote(note);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error fetching note');
            console.error('Error fetching note:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchNoteById]);

    const createNote = useCallback(async (noteData?: Partial<CreateNotePayload>) => {
        setError(null);
        try {
            let content = noteData?.content;
            if (content && typeof content === 'object') {
                content = JSON.stringify(content);
            }

            const defaultContent = JSON.stringify({
                type: 'doc',
                content: [{ type: 'paragraph' }]
            });

            const defaultNote: CreateNotePayload = {
                title: 'Untitled Note',
                content: content || defaultContent,
                tags: [],
                ...noteData,
            };
        
            const response = await fetch(`${API_BASE_URL}/notes`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(defaultNote),
            });
        
            const newNote = await handleResponse<NoteResponse>(response);
        
            let parsedContent;
            try {
                parsedContent = typeof newNote.content === 'string' && newNote.content
                    ? JSON.parse(newNote.content)
                    : newNote.content;
            } catch {
                parsedContent = { type: 'doc', content: [{ type: 'paragraph' }] };
            }
        
            const note: Note = {
                ...newNote,
                content: parsedContent,
                createdAt: newNote.createdAt || new Date().toISOString(),
                updatedAt: newNote.updatedAt || new Date().toISOString(),
            };
        
            setNotes(prev => [note, ...prev]);
            setSelectedNote(note);
        
            return note;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error creating note');
            console.error('Error creating note:', error);
            throw error;
        }
    }, []);
    
    const updateNote = useCallback(async (id: string, updates: Partial<UpdateNotePayload>) => {
        try {
            const payload = { ...updates };
            if (payload.content && typeof payload.content === 'object') {
                payload.content = JSON.stringify(payload.content);
            }
        
            const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            
            const updatedNote = await handleResponse<NoteResponse>(response);
            
            let parsedContent;
            try {
                parsedContent = typeof updatedNote.content === 'string' && updatedNote.content
                    ? JSON.parse(updatedNote.content)
                    : updatedNote.content;
            } catch {
                parsedContent = { type: 'doc', content: [{ type: 'paragraph' }] };
            }
            
            const note: Note = {
                ...updatedNote,
                content: parsedContent,
                createdAt: updatedNote.createdAt || new Date().toISOString(),
                updatedAt: updatedNote.updatedAt || new Date().toISOString(),
            };
            
            setNotes(prev => 
                prev.map(n => n._id === id ? note : n)
            );
            
            setSelectedNote(prev => 
                prev?._id === id ? note : prev
            );
            
            return note;
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }, []);
    
    const deleteNote = useCallback(async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            await handleResponse<{ message: string }>(response);
            
            setNotes(prev => prev.filter(note => note._id !== id));
            setSelectedNote(prev => prev?._id === id ? null : prev);
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }, []);
    
    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);
    
    return {
        notes,
        selectedNote,
        loading,
        error,
        fetchNotes,
        fetchNoteById,
        selectNote,
        selectNoteById,
        createNote,
        updateNote,
        deleteNote
    };
};