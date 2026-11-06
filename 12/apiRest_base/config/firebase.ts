import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Las claves salen del archivo .env (que NO se sube a git).
// En Expo, solo las variables que empiezan con EXPO_PUBLIC_ llegan a la app.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Si falta completar el .env, no conectamos: así la app muestra un aviso claro
// en lugar de un error difícil de entender.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Conecta la app con tu proyecto de Firebase (se hace una sola vez).
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

// "db" es la puerta de entrada a Firestore, la base de datos en la nube.
export const db = app ? getFirestore(app) : null;
