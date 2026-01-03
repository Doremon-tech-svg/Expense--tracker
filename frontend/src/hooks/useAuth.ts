import { useState } from "react";
import { api, setToken } from "../api/client";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      setToken(data.token);

      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function signup(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      setToken(data.token);

      return data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    window.location.href = "/login";
  }

  return { login, signup, logout, loading };
}
