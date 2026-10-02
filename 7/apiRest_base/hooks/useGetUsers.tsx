import { API_URL, User } from "@/constants/api";
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

      const response = await fetch(`${API_URL}`);
      // response.ok -> es un booleano, si salió bien la operación es true
      if (!response.ok) {
        throw new Error(`Error ${response.status} en el servidor`);
      }
      // convierte la respuesta en objeto de js para poder procesarlo
      const data: User[] = await response.json();
      console.log(data)
      setUsers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      // ya sea que haya salido bien o mal la operacion siempre lo ultimo ejecutado es finally
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]); // ahora es seguro incluirla: getUsers no cambia entre renders

  return { users, loading, error, getUsers };
}
