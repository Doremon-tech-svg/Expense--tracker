import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    await login(email, password);
    window.location.href = "/groups";
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border w-full p-2 rounded"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded"
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPass(e.target.value)}
        />

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          {loading ? "..." : "Login"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        No account?{" "}
        <a href="/signup" className="text-blue-600 underline">
          Signup
        </a>
      </p>
    </div>
  );
}
