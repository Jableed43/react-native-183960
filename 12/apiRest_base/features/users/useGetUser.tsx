import { User } from "@/features/users/api";
import { fetchUser } from "@/features/users/usersService";
import { useEffect, useState } from "react";

// Trae UN usuario por su id (GET /users/:id). Se usa en la pantalla de edición.
export function useGetUser(id: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true; // si la pantalla se cierra antes de que llegue la respuesta, no actualizamos nada

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUser(id);
        if (active) setUser(data);
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  return { user, loading, error };
}
