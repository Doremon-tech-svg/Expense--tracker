import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { logout } = useAuth();

  return (
    <div className="p-3 bg-white shadow flex justify-between items-center">
      <h1 className="font-bold text-lg">Group Ledger</h1>

      <button
        onClick={logout}
        className="text-sm text-red-600 underline"
      >
        Logout
      </button>
    </div>
  );
}
