import { Platform } from "react-native";

// Tu IP local detectada para que funcione en dispositivos físicos
// revisar en CMD -> ipconfig -> ipv4
const IP_LOCAL = "192.168.1.37";

// En un celular (Android o iPhone) "localhost" es el propio celular, no tu PC:
// por eso en nativo se usa la IP de la PC; "localhost" solo sirve en web.
const BASE_URL =
  Platform.OS === "web"
    ? `http://localhost:3000`
    : `http://${IP_LOCAL}:3000`;

export const API_URL = `${BASE_URL}/users`;

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
