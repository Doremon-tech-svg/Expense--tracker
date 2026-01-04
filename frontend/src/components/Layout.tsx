import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }: any) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-green-700">
            Group Expense
          </h1>

          <nav className="flex gap-4 text-sm">
            <Link className="hover:text-green-700" to="/dashboard">
              Dashboard
            </Link>

            <Link className="hover:text-green-700" to="/groups">
              My Groups
            </Link>

            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
}
