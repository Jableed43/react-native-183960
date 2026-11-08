import { deleteUser } from "@/features/users/usersService";
import { useCallback, useState } from "react";

// Mismo patrón otra vez: loading + error + una función que devuelve null (ok) o el mensaje de error.
export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeUser = useCallback(async (id: number): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      await deleteUser(id);
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeUser, loading, error };
}
