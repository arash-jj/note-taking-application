import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userObj: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        
        fetch('http://localhost:5500/api/me', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        })
        .then((r) => r.json())
        .then((d) => setUser(d?.user || null))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }, []);
    const login = (token: string, userObj: User) => {
        localStorage.setItem('token', token);
        setUser(userObj);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    };
    export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
