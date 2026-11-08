import { API_URL, CreateUserData, UpdateUserData, User } from "@/features/users/api";

/**
 * CAPA DE SERVICIO: el único lugar de la app que sabe cómo "hablar" con la API.
 * Los hooks y las pantallas llaman a estas funciones y no se preocupan por fetch ni por códigos de error.
 */

// Traduce el código HTTP (404, 500...) a un mensaje que entienda una persona.
function messageForStatus(status: number): string {
  if (status === 400) return "Los datos enviados no son válidos.";
  if (status === 404) return "No se encontró lo que buscabas (¿ya lo borraron?).";
  if (status >= 500) return "El servidor tuvo un problema. Probá de nuevo en un momento.";
  return `Error ${status} al comunicarse con el servidor.`;
}

// Hace UNA petición. Si algo sale mal, lanza un Error con un mensaje claro.
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // fetch solo falla así cuando no hay red o la dirección está mal
    throw new Error("No se pudo conectar con el servidor. Revisá tu conexión y la dirección de la API en el .env.");
  }

  // Ojo: fetch NO falla con un 404 o un 500. Hay que revisar response.ok nosotros.
  if (!response.ok) {
    throw new Error(messageForStatus(response.status));
  }

  return response.json();
}

// --- Las 5 operaciones (CRUD) sobre /users ---------------------------------

export const fetchUsers = () => request<User[]>(API_URL); // GET    /users
export const fetchUser = (id: number) => request<User>(`${API_URL}/${id}`); // GET    /users/:id
export const createUser = (data: CreateUserData) =>
  request<User>(API_URL, { method: "POST", body: JSON.stringify(data) }); // POST   /users
export const updateUser = (id: number, data: UpdateUserData) =>
  request<User>(`${API_URL}/${id}`, { method: "PATCH", body: JSON.stringify(data) }); // PATCH  /users/:id
export const deleteUser = (id: number) => request<unknown>(`${API_URL}/${id}`, { method: "DELETE" }); // DELETE /users/:id
