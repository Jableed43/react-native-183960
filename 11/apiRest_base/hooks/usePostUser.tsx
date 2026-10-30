import { API_URL, CreateUserData } from "@/constants/api";
import { useCallback, useState } from "react";

export function usePostUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback: mantiene la misma referencia entre renders, útil si algún día
  // se usa como dependencia de otro hook o se pasa a un componente memoizado.
  const saveUser = useCallback(async (userData: CreateUserData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al crear el usuario`);
      }

      await response.json();
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveUser, loading, error };
}
