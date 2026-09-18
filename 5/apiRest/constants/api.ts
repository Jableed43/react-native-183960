import { Platform } from "react-native";

// Tu IP local detectada para que funcione en dispositivos físicos
// revisar en CMD -> ipconfig -> ipv4
const IP_LOCAL = "192.168.1.37";

const BASE_URL =
  Platform.OS === "android"
    ? `http://${IP_LOCAL}:3000`
    : `http://localhost:3000`;

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
