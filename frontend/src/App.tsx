import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import { ProtectedRoute, PublicRoute } from "./auth/RouteGuards";
import { useAuth } from "./auth/AuthProvider";
import Archive from './routes/Archive';

/**
 * Application root component that renders the app's routed pages and layout.
 *
 * Renders public routes for `Register` and `Login`, protected routes for `Dashboard` and `Dashboard/Archive`, and a fallback redirect to `/dashboard` when a user exists or to `/login` otherwise.
 *
 * @returns The root JSX element containing the route tree and layout.
 */
function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Routes>
          <Route index element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} >
            <Route path="archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;