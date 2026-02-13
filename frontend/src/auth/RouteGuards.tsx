import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import type { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
    return user ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
    return user ? <Navigate to="/dashboard" replace /> : children;
};
