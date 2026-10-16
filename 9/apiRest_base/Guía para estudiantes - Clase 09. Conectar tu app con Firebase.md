# ☁️ Clase 09 — Conectá tu app con Firebase (Guía para estudiantes)

Hasta ahora tus datos venían de **un servidor en la computadora del profe** (`json-server`). Hoy tu app se va a conectar a **un servicio externo de Google, Firebase**: una base de datos en internet que **todos los celulares ven en tiempo real**.

- **Partís de:** tu app de usuarios de la Clase 07 (con modo oscuro). Es la misma app, no un proyecto nuevo.
- **Terminás con:** una pantalla de **notas compartidas** (lo que escribe un compañero te aparece solo, sin refrescar) y, de regalo, un **modo oscuro y un nombre que se guardan en tu celular** (AsyncStorage).
- **Tiempo estimado:** 90 a 120 minutos.

---

## 🗺️ Mapa de la guía

| Paso | Qué hacés | Archivo |
| :---: | :--- | :--- |
| 0 | Instalar Firebase y pegar el `.env` | `.env`, `package.json` |
| 1 | Conectar la app | `config/firebase.ts` |
| 2 | El tipo de dato y el hook de notas | `constants/notes.ts`, `hooks/useNotes.tsx` (nuevos) |
| 3 | La pantalla de notas | `components/NoteItem.tsx`, `app/notes.tsx` (nuevos) |
| 4 | Llegar a la pantalla | `app/_layout.tsx`, `app/index.tsx` |
| 5 | Probarlo con tus compañeros | — |
| 6 | Guardar datos en tu celular (AsyncStorage) | `hooks/useStoredState.ts` (nuevo), `context/ThemeContext.tsx`, `app/notes.tsx` |

---

## 🧠 La teoría que necesitás

### De "el servidor del profe" a "el servidor de Google"

| | `json-server` (Clase 05) | Firebase (hoy) |
| :--- | :--- | :--- |
| Quién lo mantiene | El profe, en su PC | Google |
| Dónde está | La red local (wifi del aula) | Internet |
| Quién puede usarlo | Solo quien esté en esa wifi | Cualquiera con la clave |
| Si se apaga la PC | Deja de funcionar | Sigue funcionando |
| Tiempo real | No (hay que volver a pedir) | Sí |

A esto se le llama **Backend-as-a-Service (BaaS)**: alguien ya armó y mantiene el servidor y la base de datos; vos solo los usás.

### Firestore: colecciones y documentos
**Firestore** es la base de datos de Firebase. En vez de tablas tiene **colecciones** (carpetas) y **documentos** (archivos con campos, como un objeto):

```
notes (colección)
 ├── 8fK2x... → { text: "Comprar pan", author: "Ana", done: false }
 └── Qm91p... → { text: "Estudiar hooks", author: "Luis", done: true }
```

### Dos formas de leer datos
- **Pedir una vez** (como el `fetch` de la Clase 05).
- **Suscribirse** con **`onSnapshot`**: *"avisame cada vez que algo cambie"*. Es lo que hacemos hoy, y lo que hace que las notas aparezcan solas.

### Cómo se conecta una app (3 pasos)
1. Instalás el **SDK**: `npm install firebase`.
2. Guardás las **6 claves** del proyecto en un archivo **`.env`**. En Expo solo llegan a la app las variables que empiezan con **`EXPO_PUBLIC_`**.
3. `initializeApp` conecta tu app con el proyecto y `getFirestore` te da `db`, la puerta de entrada a la base.

> 🔐 **Seguridad:** esas claves **no son secretas** (cualquiera que abra la app las ve). Quien decide *quién puede leer o borrar* son las **reglas** de Firestore, que se configuran en la consola de Firebase.

### Y una segunda forma de guardar: AsyncStorage (en tu celular)
Firebase guarda los datos **en la nube**. **AsyncStorage** los guarda **en el propio celular** (como un cuaderno de notas privado de tu app): sirve para preferencias que no hace falta compartir, como el modo oscuro o tu nombre.

| | ☁️ Firestore (nube) | 📦 AsyncStorage (celular) |
| :--- | :--- | :--- |
| Dónde viven los datos | En internet | En ese celular |
| ¿Los ven otros? | Sí, todos | No, solo tu app |
| ¿Hace falta internet? | Sí | No |
| Ideal para | Notas, chats, datos compartidos | Preferencias: tema, idioma, nombre |

---

## 🪜 Paso 0 — Instalar Firebase y pegar el `.env`

1. Abrí tu proyecto de la Clase 07 (o la carpeta `apiRest_base` que te pasa el profe).
2. Instalá Firebase **con esta versión** (si tu base ya lo trae, podés saltear este punto):

```bash
npm install firebase@11.10.0
```

3. En la **raíz** del proyecto (al lado de `package.json`) creá un archivo llamado **`.env`** (con el punto adelante) y pegá lo que te pasa el profe. Tiene este formato:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

4. Agregá `.env` a tu `.gitignore` (para no subir las claves a GitHub).
5. **Reiniciá con la caché limpia** (Expo lee el `.env` solo al arrancar):

```bash
npx expo start -c
```

✅ **Comprobá:** la app abre igual que antes.

---

## 🪜 Paso 1 — Conectar la app

Creá la carpeta **`config`** y el archivo **`config/firebase.ts`** (si no lo trae tu base):

```ts
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
```

**Qué mirar:**
- `process.env.EXPO_PUBLIC_…` trae cada clave del `.env`.
- `isFirebaseConfigured` comprueba que las claves existan. Si falta el `.env`, la app **no se rompe**: muestra un aviso claro en la pantalla de notas.
- `initializeApp(firebaseConfig)` conecta tu app con el proyecto de Firebase.
- `getFirestore(app)` devuelve `db`, que usaremos para leer y escribir.

---

## 🪜 Paso 2 — El tipo y el hook de notas

Creá **`constants/notes.ts`**:

```ts
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
```

Y creá **`hooks/useNotes.tsx`**:

```tsx
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

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // true si pasaron 8 s sin que el servidor de Firebase confirme nada (claves mal, Firestore sin crear, sin internet)
  const [offline, setOffline] = useState(false);

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

  // Crear: addDoc agrega un documento nuevo con un id automático
  const addNote = useCallback(async (text: string, author: string) => {
    if (!db) return false;
    try {
      await addDoc(collection(db, NOTES_COLLECTION), {
        text,
        author,
        done: false,
        createdAt: Date.now(),
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    }
  }, []);

  // Actualizar: updateDoc cambia solo los campos que le indicamos
  const toggleNote = useCallback(async (note: Note) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, NOTES_COLLECTION, note.id), { done: !note.done });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }, []);

  // Borrar: deleteDoc elimina el documento
  const deleteNote = useCallback(async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, NOTES_COLLECTION, id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }, []);

  return { notes, loading, error, offline, addNote, toggleNote, deleteNote };
}
```

**Qué mirar** (son las 4 letras del CRUD):

| Operación | Función de Firestore | En el hook |
| :--- | :--- | :--- |
| **Leer en vivo** | `onSnapshot(consulta, callback)` | el `useEffect` |
| **Crear** | `addDoc(colección, datos)` | `addNote` |
| **Actualizar** | `updateDoc(documento, {campos})` | `toggleNote` |
| **Borrar** | `deleteDoc(documento)` | `deleteNote` |

- `query(collection(db, "notes"), orderBy("createdAt", "desc"))` significa "la colección `notes`, de la más nueva a la más vieja". Por eso al crear guardamos `createdAt: Date.now()`.
- **`return unsubscribe`:** al salir de la pantalla se cierra la suscripción (como cualquier `useEffect` con un listener). Si no, seguiría escuchando.
- `{ id: d.id, ...d.data() }`: el `id` viene aparte de los datos; los juntamos.
- **El banner rojo de 8 segundos:** Firestore guarda una copia local, así que tus notas "aparecen" aunque no haya conexión real. Si en 8 segundos el servidor no confirma nada, la pantalla te avisa con un banner rojo (`fromCache` te dice de dónde viene el dato).
- Es el mismo patrón que `useGetUsers` y `usePostUser` de la Clase 05: `loading`, `error`, `try/catch` y funciones con `useCallback`.

---

## 🪜 Paso 3 — La pantalla de notas

Creá **`components/NoteItem.tsx`**:

```tsx
import { Note } from "@/constants/notes";
import { useTheme } from "@/context/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NoteItemProps {
  note: Note;
  onToggle: (note: Note) => void;
  onDelete: (id: string) => void;
}

// memo + funciones estables (useCallback en useNotes): la nota solo se redibuja si ella cambió.
export const NoteItem = memo(({ note, onToggle, onDelete }: NoteItemProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.content} onPress={() => onToggle(note)}>
        <Text style={styles.check}>{note.done ? "✅" : "⬜"}</Text>
        <View style={styles.texts}>
          <Text
            style={[
              styles.text,
              { color: note.done ? colors.textDisabled : colors.text },
              note.done && styles.textDone,
            ]}
          >
            {note.text}
          </Text>
          <Text style={[styles.author, { color: colors.textSecondary }]}>por {note.author}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(note.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    gap: 10,
  },
  content: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  check: { fontSize: 22 },
  texts: { flex: 1 },
  text: { fontSize: 16 },
  textDone: { textDecorationLine: "line-through" },
  author: { fontSize: 12, marginTop: 2 },
  delete: { fontSize: 20 },
});
```

Y creá **`app/notes.tsx`**:

```tsx
import { NoteItem } from "@/components/NoteItem";
import { useTheme } from "@/context/ThemeContext";
import { useNotes } from "@/hooks/useNotes";
import { useStoredState } from "@/hooks/useStoredState";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notes() {
  const { colors } = useTheme();
  const { notes, loading, error, offline, addNote, toggleNote, deleteNote } = useNotes();

  // Guardado LOCAL (AsyncStorage): el nombre queda en el celular y no hay que escribirlo cada vez.
  const [author, setAuthor] = useStoredState("@apiRest:author", "");
  // Estado normal: el texto de la nota nueva no hace falta guardarlo.
  const [text, setText] = useState("");

  const canAdd = text.trim() !== "" && author.trim() !== "";

  const handleAdd = useCallback(() => {
    if (!canAdd) return;
    // Guardado en la NUBE: la nota viaja a Firestore.
    // Limpiamos el campo enseguida (Firestore la guarda y la sincroniza en segundo plano).
    addNote(text.trim(), author.trim());
    setText("");
  }, [canAdd, addNote, text, author]);

  const inputThemeStyle = {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right"]}>
      <View style={[styles.form, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Tu nombre (se guarda en tu celular)</Text>
        <TextInput
          style={[styles.input, inputThemeStyle]}
          value={author}
          onChangeText={setAuthor}
          placeholder="Ej: Ana"
          placeholderTextColor={colors.textDisabled}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Nueva nota (se guarda en la nube)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.rowInput, inputThemeStyle]}
            value={text}
            onChangeText={setText}
            placeholder="Escribí una nota..."
            placeholderTextColor={colors.textDisabled}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: canAdd ? colors.primary : colors.textDisabled }]}
            onPress={handleAdd}
            disabled={!canAdd}
          >
            <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {offline && !error && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.error }]}>
          <Text style={[styles.offlineText, { color: colors.onPrimary }]}>
            ⚠️ Sin conexión con Firebase: lo que escribas NO se está guardando en la nube. Revisá el .env, que Firestore esté creado y tu internet.
          </Text>
        </View>
      )}

      {error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.error }]}>No se pudo conectar con Firebase</Text>
          <Text style={{ color: colors.textSecondary, textAlign: "center" }}>{error}</Text>
          <Text style={[styles.hint, { color: colors.textDisabled }]}>
            Revisá el archivo .env y las reglas de Firestore. Después reiniciá con: npx expo start -c
          </Text>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteItem note={item} onToggle={toggleNote} onDelete={deleteNote} />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: colors.textSecondary }}>Todavía no hay notas. ¡Escribí la primera!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Solo estructura: los colores se aplican arriba con useTheme().
  container: { flex: 1 },
  form: { padding: 16, borderBottomWidth: 1 },
  label: { fontSize: 12, marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12, fontSize: 16 },
  row: { flexDirection: "row", gap: 8 },
  rowInput: { flex: 1, marginBottom: 0 },
  addButton: { paddingHorizontal: 16, borderRadius: 8, justifyContent: "center" },
  addButtonText: { fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 8 },
  errorText: { fontSize: 16, fontWeight: "600" },
  hint: { fontSize: 12, textAlign: "center", marginTop: 8 },
  offlineBanner: { padding: 10 },
  offlineText: { fontSize: 12, textAlign: "center" },
});
```

**Qué mirar:**
- Tiene tres zonas: el **formulario** (tu nombre y la nota), los **estados** (error / cargando / lista) y cada **nota** (`NoteItem`).
- `handleAdd` limpia el campo enseguida: Firestore guarda y sincroniza en segundo plano.
- `NoteItem` usa `memo` (Clase 06) y `useTheme` (Clase 07): todo lo que aprendiste sigue sirviendo.

---

## 🪜 Paso 4 — Llegar a la pantalla de notas

En **`app/_layout.tsx`**, dentro del `<Stack>`:

```tsx
<Stack.Screen name="notes" options={{ title: "Notas en la nube" }} />
```

En **`app/index.tsx`**, junto a `handleGoToCreate`:

```tsx
const handleGoToNotes = useCallback(() => {
  router.push("/notes");
}, [router]);
```

Y en el `header`, dentro de `headerActions`, **entre el botón 🌙 y "+ Nuevo Usuario"**:

```tsx
<TouchableOpacity
  style={[styles.themeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
  onPress={handleGoToNotes}
>
  <Text style={styles.themeButtonText}>☁️</Text>
</TouchableOpacity>
```

✅ **Comprobá:** aparece el botón ☁️ y abre la pantalla de notas.

---

## 🪜 Paso 5 — Probarlo con tus compañeros

1. Escribí tu nombre y una nota → **Agregar**.
2. Cuando tus compañeros hagan lo mismo, **sus notas aparecen solas** en tu pantalla. 🎉
3. Tocá una nota para tacharla (se tacha **en todos** los celulares). Tocá 🗑️ para borrarla.
4. Pedile al profe que abra la consola de Firebase: vas a ver los **documentos** aparecer en vivo.

---

## 🪜 Paso 6 — Guardar datos en tu celular con AsyncStorage

Hasta ahora, si cerrás la app **el modo oscuro se pierde** (vuelve a claro) y tenés que volver a escribir tu nombre. Lo arreglamos guardándolos en el celular.

### 6.1 — Instalar
```bash
npx expo install @react-native-async-storage/async-storage
```
(Usá siempre `expo install`: elige la versión compatible con tu SDK.)

### 6.2 — Un `useState` que se acuerda
Creá **`hooks/useStoredState.ts`**:

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/**
 * useState que se acuerda del valor aunque cierres la app.
 *
 *   const [nombre, setNombre, isReady] = useStoredState("@apiRest:nombre", "");
 *
 * - Al montarse, LEE el valor guardado en el celular (AsyncStorage).
 * - Cada vez que el valor cambia, lo GUARDA.
 * - isReady avisa cuando terminó de leer (leer es asíncrono: tarda un instante).
 */
export function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  // 1) Leer lo que había guardado (una sola vez)
  useEffect(() => {
    let active = true; // evita actualizar el estado si la pantalla ya se cerró

    const loadValue = async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        // AsyncStorage solo guarda texto: JSON.parse lo vuelve a su forma original
        if (saved !== null && active) {
          setValue(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error al leer", key, error);
      } finally {
        if (active) setIsReady(true);
      }
    };

    loadValue();
    return () => {
      active = false;
    };
  }, [key]);

  // 2) Guardar cada vez que cambia (pero solo después de haber leído, para no pisar el valor guardado)
  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) =>
      console.error("Error al guardar", key, error)
    );
  }, [key, value, isReady]);

  return [value, setValue, isReady] as const;
}
```

**Qué mirar:**
- Se usa **igual que `useState`**: `const [valor, setValor, isReady] = useStoredState("clave", valorInicial)`. Solo suma un tercer valor.
- AsyncStorage guarda **solo texto**: por eso `JSON.stringify` al guardar y `JSON.parse` al leer.
- **Primer `useEffect`:** al aparecer, **lee** lo guardado.
- **`isReady`:** leer tarda un instante (es asíncrono). Este valor avisa cuándo ya terminó.
- **Segundo `useEffect`:** cada vez que el valor cambia, lo **guarda**. Lo hace **solo si `isReady`**: si no, al arrancar guardaría el valor inicial *antes* de leer y pisaría lo que tenías guardado.
- La clave lleva un **prefijo** (`@apiRest:...`) para no pisarse con otras apps.
- `as const` hace que TypeScript sepa que devuelve `[valor, función, boolean]` en ese orden.

### 6.3 — Que el modo oscuro se acuerde
Abrí **`context/ThemeContext.tsx`** y hacé **solo 3 cambios**:

```tsx
// 1) Imports: sacá "useState" de la lista y sumá el hook nuevo
import { useStoredState } from "@/hooks/useStoredState";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";

// 2) Dentro de ThemeProvider, reemplazá el useState por useStoredState:
//    ANTES:  const [theme, setTheme] = useState<Theme>("light");
const [theme, setTheme, isReady] = useStoredState<Theme>("@apiRest:theme", "light");

// 3) Justo antes del return del Provider:
if (!isReady) return null;
```

- El resto del archivo **no cambia**: ni `toggleTheme`, ni `useTheme`, ni ninguna pantalla.
- `if (!isReady) return null;` evita que se vea un instante el tema claro antes de pasar al oscuro.

### 6.4 — Que el nombre se acuerde
En **`app/notes.tsx`** sumá el import y reemplazá el `useState` del nombre:

```tsx
import { useStoredState } from "@/hooks/useStoredState";

// ANTES:  const [author, setAuthor] = useState("");
const [author, setAuthor] = useStoredState("@apiRest:author", "");
```

(El texto de la nota nueva sigue siendo un `useState` común: no hace falta guardarlo.)

✅ **Comprobá:**
1. Poné **modo oscuro** → **cerrá la app por completo** (sacala de las apps recientes) → abrila: **sigue oscura** 🎉.
2. Escribí tu nombre en las notas → cerrá la app → abrila: **tu nombre sigue ahí**.
3. Las notas de la nube siguen apareciendo como antes.

> 🧠 **Para pensar:** ¿por qué el tema y el nombre van en AsyncStorage y las notas en Firestore? (Pista: ¿a quién le importa cada dato?)

---

## 🔍 Revisión final

- [ ] El `.env` está en la raíz y **no** se sube a git.
- [ ] Las notas se ven en todos los celulares y se actualizan solas.
- [ ] Sabés explicar qué diferencia hay entre `json-server` y Firebase.
- [ ] Sabés por qué las claves no son secretas y qué protege realmente los datos.
- [ ] El modo oscuro y tu nombre se mantienen al cerrar y abrir la app.
- [ ] Sabés explicar cuándo conviene AsyncStorage y cuándo Firebase.
- [ ] `npx tsc --noEmit` sin errores.

---

## 🆘 Si algo no anda

| Qué pasa | Por qué | Qué hacer |
| :--- | :--- | :--- |
| "Falta configurar Firebase: completá el archivo .env" | El `.env` no existe, está en otra carpeta o tiene mal el nombre | Debe llamarse **`.env`**, estar junto a `package.json`, y reiniciar con `npx expo start -c` |
| **Banner rojo "Sin conexión con Firebase"** (o tus notas no las ve nadie más) | Una clave está mal copiada (sobre todo `PROJECT_ID`), o falta crear la base, o no hay internet | Revisá el `.env` letra por letra y tu internet; si sigue, avisale al profe |
| `Missing or insufficient permissions` | Las reglas de Firestore no permiten leer o escribir | Avisale al profe |
| Las notas no aparecen en otro celular | Están usando proyectos Firebase distintos | Que todos usen el mismo `.env` |
| `Unable to resolve "firebase/..."` | `firebase` no está instalado | `npm install firebase@11.10.0` y `npx expo start -c` |
| Cambié el `.env` y no se nota | Expo no recargó las variables | `npx expo start -c` |
| La lista de usuarios queda cargando | El servidor no está prendido con `npm run start` | Prendelo (carpeta `server`) |
| El tema vuelve a claro al reabrir | No se conectó `useStoredState` | Revisá el Paso 6.3 |
| Se ve claro un instante y pasa a oscuro | Falta `if (!isReady) return null;` | Agregalo en `ThemeProvider` |
| El nombre no se guarda | La clave cambia entre usos | Debe ser siempre `"@apiRest:author"` |
| `Unable to resolve "@react-native-async-storage/async-storage"` | No está instalado | `npx expo install @react-native-async-storage/async-storage` y `npx expo start -c` |
| Quiero repetir la prueba desde cero | AsyncStorage persiste | Borrá los datos de Expo Go en los ajustes del celular |

---

## 🌟 Para animarte (opcional)

1. **Favoritos:** con `useStoredState` guardá en el celular una lista de ids de notas favoritas.
2. **Editar notas:** con `updateDoc`, cambiá el texto de una nota.
3. **Pedir una vez:** reemplazá `onSnapshot` por `getDocs` y compará qué pasa cuando un compañero agrega una nota.
4. **Login:** investigá `firebase/auth` para que cada nota lleve el usuario real.
5. **Tu propio proyecto Firebase:** seguí el apéndice de abajo y probá con tus claves.

---

## 📎 Apéndice — Crear tu propio proyecto de Firebase (para hacer en casa)

> Los nombres de los botones pueden variar un poco: la idea siempre es la misma.

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Google → **Crear un proyecto** (podés desactivar Google Analytics).
2. **Compilación → Firestore Database → Crear base de datos** → elegí una ubicación → modo de producción. *(Sin este paso, la app muestra el banner rojo.)*
3. **Configuración del proyecto (⚙️) → General → Tus apps → ícono Web `</>`** → registrá la app → copiá los 6 valores de `firebaseConfig` a tu `.env`.
4. En **Firestore → Reglas** pegá esto y **Publicar** (sin esto, la app muestra *"Missing or insufficient permissions"*):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo la colección "notes" es accesible. Todo lo demás queda bloqueado.
    match /notes/{noteId} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Estas reglas son **solo para practicar**: cualquiera con las claves puede leer y escribir en `notes`. Para una app real se usan reglas con usuarios autenticados.

---

## 📚 Lo que aprendiste

- **Qué es un BaaS** y en qué se diferencia de tener tu propio servidor.
- **Cómo conectar una app a un servicio externo:** claves en `.env` → SDK de Firebase → `db`.
- **Firestore:** colecciones y documentos, y las operaciones de crear, leer, actualizar y borrar.
- **`onSnapshot`:** datos en tiempo real, y por qué hay que cerrar la suscripción.
- **Seguridad:** las claves no son secretas; las **reglas** protegen los datos.
- **AsyncStorage:** guardar y leer datos en el celular, con `JSON.stringify` / `JSON.parse`, y cuándo conviene en vez de la nube.
- **Hook propio `useStoredState`:** un `useState` que sobrevive a cerrar la app.
- **Verificar en el servidor:** que la app "se vea bien" no alcanza; hay que mirar si el dato llegó a la base.

---

**➡️ Próxima clase (10):** navegación avanzada y animaciones. Guardá tu proyecto.
