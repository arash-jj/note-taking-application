import { useAuth } from '../auth/AuthProvider';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <button
          onClick={logout}>
        Logout
      </button>
      <br />
      Dashboard
    </div>
  );
}
