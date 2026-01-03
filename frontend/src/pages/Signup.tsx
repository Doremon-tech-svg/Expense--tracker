import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { signup, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    await signup(name, email, password);
    window.location.href = "/groups";
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border w-full p-2 rounded"
          placeholder="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-2 rounded"
          placeholder="password"
          value={password}
          onChange={e => setPass(e.target.value)}
        />

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          {loading ? "..." : "Create Account"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Login
        </a>
      </p>
    </div>
  );
}
