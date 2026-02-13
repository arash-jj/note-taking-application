import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import { ProtectedRoute, PublicRoute } from "./auth/RouteGuards";
import { useAuth } from "./auth/AuthProvider";

function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Routes>
          <Route index element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
