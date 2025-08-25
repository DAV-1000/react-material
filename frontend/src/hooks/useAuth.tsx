import { useEffect, useState } from "react";
import type { User } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/.auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.clientPrincipal ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user;
}
