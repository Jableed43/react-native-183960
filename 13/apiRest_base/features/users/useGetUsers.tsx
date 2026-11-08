import { User } from "@/features/users/api";
import { fetchUsers } from "@/features/users/usersService";
import { useCallback, useEffect, useState } from "react";

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback: sin esto, getUsers se crea de nuevo en CADA render,
  // y si la incluimos como dependencia del useEffect de abajo, entramos en bucle infinito.
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Antes acá estaba todo el fetch. Ahora lo hace la capa de servicio.
      setUsers(await fetchUsers());
    } catch (error) {
      // El servicio ya arma un mensaje claro para la persona.
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]); // ahora es seguro incluirla: getUsers no cambia entre renders

  return { users, loading, error, getUsers };
}
