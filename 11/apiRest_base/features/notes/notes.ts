// Nombre de la colección en Firestore (como una "carpeta" de documentos)
export const NOTES_COLLECTION = "notes";

// Forma de una nota. El id lo genera Firestore.
export interface Note {
  id: string;
  text: string;
  author: string;
  done: boolean;
  createdAt: number; // fecha en milisegundos, para ordenar
}
