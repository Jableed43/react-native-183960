// Tu IP local detectada para que funcione en dispositivos físicos
// revisar en CMD -> ipconfig -> ipv4
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const API_URL = `${API_BASE_URL}/users`;

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  // "?" significa que el dato es opcional
  phone?: string;
  website?: string;
}

// Datos que hay que enviar para crear un usuario (el id lo genera el servidor)
export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
}

// Para editar mandamos solo lo que cambió: por eso todos los campos son opcionales.
export type UpdateUserData = Partial<CreateUserData>;