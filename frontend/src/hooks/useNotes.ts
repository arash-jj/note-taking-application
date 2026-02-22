import { useState, useEffect, useCallback } from 'react';
import type { Note, CreateNotePayload, UpdateNotePayload, NoteResponse } from '../types/note'; 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let message = 'Request failed';
        try {
        const error = await response.json();
        message = error.message || message;
        } catch {
        // Non-JSON error body
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

    // Fetch all notes
    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/notes`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            
            const data = await handleResponse<Note[]>(response);
            setNotes(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error fetching notes');
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    }, []);
    // Fetch a single note by ID
    const fetchNoteById = useCallback(async (id: string): Promise<Note> => {
        const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        });
        
        return handleResponse<Note>(response);
    }, []);
    // Select a note (can be used with the fetched note)
    const selectNote = useCallback((note: Note | null) => {
        setSelectedNote(note);
    }, []);
    // Select a note by ID (fetches the note first)
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

    // Create a new note
    const createNote = useCallback(async (noteData?: Partial<CreateNotePayload>) => {
        setError(null);
        try {
        const defaultNote: CreateNotePayload = {
            title: 'Untitled Note',
            content: {
            type: 'doc',
            content: [{ type: 'paragraph' }]
            },
            ...noteData
        };
        
        const response = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(defaultNote),
        });
        
        const newNote = await handleResponse<NoteResponse>(response);
        
        // Convert NoteResponse to Note (add any missing fields)
        const note: Note = {
            ...newNote,
            // Ensure all required fields are present
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
    // Update a note
    const updateNote = useCallback(async (id: string, updates: Partial<UpdateNotePayload>) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            
            const updatedNote = await handleResponse<NoteResponse>(response);
            
            const note: Note = {
                ...updatedNote,
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
    // Delete a note
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
    // Load notes on mount
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