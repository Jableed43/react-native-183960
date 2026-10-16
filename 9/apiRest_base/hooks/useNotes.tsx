import { NOTES_COLLECTION, Note } from "@/constants/notes";
import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export function useNotes(){
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // que pasa si se pierde la conexion?
    const [offline, setOffline] = useState(false)

// onSnapshot = "avisame cada vez que cambie algo en la nube".
  // Es una suscripción en vivo: no hay que volver a pedir los datos.
  useEffect(() => {
    if (!db) {
      setError("Falta configurar Firebase: completá el archivo .env");
      setLoading(false);
      return;
    }

    const notesQuery = query(collection(db, NOTES_COLLECTION), orderBy("createdAt", "desc"));

    // Firestore guarda una copia local: aunque NO haya conexión real, las notas que escribas
    // "aparecen" igual en tu pantalla. Por eso hay que comprobar que el servidor responda.
    // Si en 8 segundos no hubo confirmación del servidor, mostramos un aviso.
    const slowTimer = setTimeout(() => {
      setOffline(true);
      setLoading(false);
    }, 8000);

    const unsubscribe = onSnapshot(
      notesQuery,
      { includeMetadataChanges: true },
      (snapshot) => {
        // fromCache = true  -> el dato viene de la copia local
        // fromCache = false -> lo confirmó el servidor de Firebase
        if (!snapshot.metadata.fromCache) {
          clearTimeout(slowTimer);
          setOffline(false);
        }
        // Cada documento trae sus datos con .data(); el id viene aparte
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Note);
        setNotes(data);
        setError(null);
        setLoading(false);
      },
      (err) => {
        clearTimeout(slowTimer);
        setError(err.message);
        setLoading(false);
      }
    );

    // Limpieza: al salir de la pantalla cerramos la suscripción (igual que con los sensores)
    return () => {
      clearTimeout(slowTimer);
      unsubscribe();
    };
  }, []);

  // Creacion de notas: addDoc agrega un documento nuevo con un id automatico
  const addNote = useCallback(async (text: string, author: string) => {
    if(!db) return false
    try {
        await addDoc(collection(db, NOTES_COLLECTION), {
            text,
            author,
            done: false,
            createdAt: Date.now()
        })
        
        return true
    } catch (error) {
        setError(error instanceof Error ? error.message : `Error desconocido: ${error}`)
        return false
    }
  }, []);

  // actualiza, cambia done por true o false
  const toggleNote = useCallback(async (note: Note) => {
    if(!db) return;
    try {
        await updateDoc(doc(db, NOTES_COLLECTION, note.id), { done: !note.done })
    } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
    }
  }, [])

  // Borrar: deleteDoc elimina el documento
  const deleteNote = useCallback(async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, NOTES_COLLECTION, id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }, []);

  return {notes, loading, error, offline, addNote, toggleNote, deleteNote}

}