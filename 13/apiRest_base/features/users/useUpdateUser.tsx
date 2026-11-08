import { UpdateUserData } from "@/features/users/api";
import { updateUser } from "@/features/users/usersService";
import { useCallback, useState } from "react";

// Mismo patrón que usePostUser: loading + error + una función que devuelve null (ok) o el mensaje de error.
export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editUser = useCallback(async (id: number, data: UpdateUserData): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      await updateUser(id, data);
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  }, []);

  return { editUser, loading, error };
}
