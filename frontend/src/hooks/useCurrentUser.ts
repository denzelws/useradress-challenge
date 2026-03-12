import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type User } from "@/services/UserServices";

export function useCurrentUser(redirectIfEmpty = true) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("solution_user");

    if (!saved) {
      if (redirectIfEmpty) navigate("/");
      return;
    }

    setUser(JSON.parse(saved));
  }, [navigate, redirectIfEmpty]);

  const logout = () => {
    localStorage.removeItem("solution_user");
    navigate("/");
  };

  return { user, logout };
}
