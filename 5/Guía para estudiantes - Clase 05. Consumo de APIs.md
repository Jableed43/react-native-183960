# 🌐 Clase 05 — Conectá tu app a internet: consumir una API (Guía para estudiantes)

En esta guía tu app deja de mostrar datos "de mentira" y **pide usuarios a un servidor**, los muestra en una lista y te deja **crear uno nuevo**.

- **Partís de:** un proyecto Expo con `expo-router` (el de la clase) y la carpeta `server` con la API de usuarios.
- **Terminás con:** una pantalla con la lista de usuarios (con carga, error y *pull-to-refresh*) y otra pantalla con un formulario para crear usuarios.
- **Tiempo estimado:** 90 a 120 minutos.

---

## 🗺️ Mapa de la guía

| Paso | Qué hacés | Archivo |
| :---: | :--- | :--- |
| 1 | Mirar la API en el navegador | — |
| 2 | Dirección de la API y tipos | `constants/api.ts` |
| 3 | Traer usuarios (GET) | `hooks/useGetUsers.tsx` |
| 4 | Tarjeta de un usuario | `components/UserCard.tsx` |
| 5 | Pantalla con la lista | `app/index.tsx` |
| 6 | Crear usuarios (POST) | `hooks/usePostUser.tsx` |
| 7 | Pantalla del formulario + botón | `app/create-user.tsx`, `app/index.tsx`, `app/_layout.tsx` |

---

## 🧠 La teoría que necesitás (10 minutos de lectura)

### ¿Qué es una API REST?
Pensalo como un **restaurante**: el **servidor** es la cocina, la **API** es el menú y **`fetch`** es el mozo que lleva tu pedido y trae la respuesta. Cada tipo de dato ("recurso") tiene su propia dirección (URL):

- `http://…/users` → la lista de usuarios
- `http://…/users/3` → el usuario número 3

### Los verbos HTTP
| Verbo | Significa | ¿Manda datos (`body`)? | Hoy |
| :--- | :--- | :---: | :---: |
| **GET** | "Traeme información" | No | ✅ |
| **POST** | "Guardá esto nuevo" | Sí (JSON) | ✅ |
| **PUT / PATCH** | "Cambiá esto" | Sí | solo teoría |
| **DELETE** | "Eliminá esto" | No | solo teoría |

### Códigos de estado (status)
| Rango | Significa | Ejemplo |
| :--- | :--- | :--- |
| **2xx** | Todo bien | `200 OK`, `201 Created` |
| **4xx** | El error es tuyo | `404` (URL mal escrita) |
| **5xx** | El error es del servidor | `500` |

En el código esto se ve como **`response.ok`**: es `true` para 2xx y `false` para el resto.

### JSON
Es el formato en el que viajan los datos: `{ }` es **un** elemento (objeto) y `[ ]` es una **lista** de elementos.
- `JSON.stringify(objeto)` → de objeto a texto, para **enviar**.
- `response.json()` → de texto a objeto, al **recibir**.

### Hook propio (custom hook)
Una función cuyo nombre empieza con `use` y que **guarda la lógica aparte**, para que la pantalla solo se ocupe de **dibujar**. Hoy hacemos dos: `useGetUsers` (traer) y `usePostUser` (crear). Es React común: se usa igual en web que en celular.

---

## ✅ Antes de empezar

1. **Prendé la API.** En la carpeta `server`: `npm install` (solo la primera vez) y después:

```bash
npm run start
```

   > ⚠️ **Siempre `npm run start`, nunca `npm run dev`.** Con `dev` el servidor solo escucha dentro de tu PC y **el celular se queda cargando para siempre**.

2. **Tu IP.** Abrí CMD, escribí `ipconfig` y anotá la **Dirección IPv4** de tu wifi (ej: `192.168.1.33`).
3. **Probala en el navegador de tu PC:** `http://TU_IP:3000/users`. Tenés que ver una lista en JSON. **Si esto no anda, nada va a andar.**
4. **Celular y PC en la misma wifi** (cuidado con redes de invitados o de instituciones, que aíslan los dispositivos).
5. Si Windows pregunta "¿Permitir que Node.js acceda a la red?", elegí **Permitir en redes privadas**.
6. **Tu app:** abrila con `npx expo start` y escaneá el QR con Expo Go.

---

## 🪜 Paso 1 — Mirar la API "desnuda"

En Chrome abrí `http://TU_IP:3000/users` y después `http://TU_IP:3000/users/3`.

Una API es **solo una dirección que devuelve datos en vez de una página**. Tu app va a pedir esto mismo.

✅ **Comprobá:** ves una lista de usuarios y, en `/users/3`, un solo usuario.

---

## 🪜 Paso 2 — La dirección y los tipos: `constants/api.ts`

Creá la carpeta `constants` (si no existe) y el archivo **`constants/api.ts`**. **Cambiá `IP_LOCAL` por tu IP.**

```ts
import { Platform } from "react-native";

// ⚠️ Reemplazá por TU IP: CMD -> ipconfig -> "Dirección IPv4" (ej: 192.168.1.33)
const IP_LOCAL = "192.168.1.33";

// En un celular, "localhost" es el propio celular y no tu PC: por eso en celular
// (Android o iPhone) usamos la IP de la PC. "localhost" solo sirve en web.
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
```

**Qué mirar:**
- `"localhost"` significa "este mismo dispositivo". En el celular sería el propio celular, no tu PC: por eso usamos la IP.
- `interface User` es el "molde" de los datos que esperamos recibir. El `?` marca un campo **opcional**.
- `CreateUserData` son los datos que **vos mandás** al crear (el `id` lo pone el servidor).

✅ **Comprobá:** `npx tsc --noEmit` sin errores.

---

## 🪜 Paso 3 — Hook para traer usuarios: `hooks/useGetUsers.tsx`

Creá la carpeta **`hooks`** y el archivo **`hooks/useGetUsers.tsx`**:

```tsx
import { API_URL, User } from '@/constants/api'
import { useEffect, useState } from 'react'

export function useGetUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const getUsers = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`${API_URL}`)
            // response.ok -> es un booleano, si salió bien la operación es true
            if(!response.ok){
                throw new Error(`Error ${response.status} en el servidor`)
            }
            // convierte la respuesta en objeto de js para poder procesarlo
            const data : User[] = await response.json()

            setUsers(data)

        } catch (error) {
            setError(error instanceof Error ? error.message : "Error desconocido" )
            // ya sea que haya salido bien o mal la operacion siempre lo ultimo ejecutado es finally
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

  return { users, loading, error, getUsers }
}
```

**Qué mirar:**
1. **Tres estados:** `users` (los datos), `loading` (¿esperando?) y `error` (¿falló algo?).
2. **`async/await`:** `fetch` tarda porque es internet; `await` significa "esperá acá hasta que llegue".
3. **Doble `await`:** el primero espera la **conexión**, el segundo espera que **se descarguen los datos**.
4. **`response.ok`:** si el servidor respondió con error, lanzamos un `Error` a propósito para caer al `catch`.
5. **`try / catch / finally`:** si algo falla la app no explota; el `finally` corre **siempre** y apaga el "cargando".
6. **`useEffect(..., [])`:** los corchetes vacíos significan "hacelo **una sola vez**, cuando la pantalla aparece".
7. El hook **devuelve** todo lo que la pantalla necesita, incluida `getUsers` para volver a pedir.

---

## 🪜 Paso 4 — Una tarjeta para cada usuario: `components/UserCard.tsx`

Creá la carpeta **`components`** y el archivo **`components/UserCard.tsx`**:

```tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { User } from "@/constants/api";

interface UserCardProps {
  user: User;
}

// Componente que dibuja UN usuario. La lista (FlatList) lo repite por cada elemento.
export const UserCard = ({ user }: UserCardProps) => (
  <View style={styles.userItem}>
    <Text style={styles.userName}>{user.name}</Text>
    <Text style={styles.userEmail}>{user.email}</Text>
  </View>
);

const styles = StyleSheet.create({
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#666",
    marginTop: 4,
  },
});
```

Es un componente que dibuja **un** usuario. La lista lo va a repetir por cada elemento.

---

## 🪜 Paso 5 — La pantalla con la lista: `app/index.tsx`

Reemplazá todo el contenido de **`app/index.tsx`**:

```tsx
import { UserCard } from "@/components/UserCard";
import { useGetUsers } from "@/hooks/useGetUsers";
import React from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  // destructuracion de objetos
  const { error, getUsers, loading, users } = useGetUsers();

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo conectar: {error}</Text>
        <Button title="Reintentar" onPress={getUsers} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de usuarios</Text>
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5d5da3" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <UserCard user={item} />}
          refreshing={loading}
          onRefresh={getUsers}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No hay usuarios disponibles.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "rgb(207, 107, 107)", marginBottom: 10, textAlign: "center" },
});
```

**Qué mirar:**
- `const { error, getUsers, loading, users } = useGetUsers();` → la pantalla **no sabe nada** de `fetch`: solo pide lo que necesita al hook.
- **Tres "estados de pantalla"** en orden: error → cargando → lista.
- **`FlatList`:**
  - `data` = qué lista dibujar.
  - `renderItem` = cómo se ve cada elemento.
  - `keyExtractor` = un identificador único por elemento (usá el `id`, nunca la posición).
  - `refreshing` + `onRefresh` = **arrastrá la lista hacia abajo y se vuelve a pedir todo**, sin código extra.
- `SafeAreaView` de **`react-native-safe-area-context`** evita que el contenido quede tapado por la cámara o la barra del celular.

✅ **Comprobá:** aparecen los usuarios con nombre y email. Si arrastrás hacia abajo, se recarga. Si apagás el server y reabrís la app, aparece el mensaje de error con el botón **Reintentar**.

---

## 🪜 Paso 6 — Hook para crear usuarios: `hooks/usePostUser.tsx`

Creá **`hooks/usePostUser.tsx`**:

```tsx
import { API_URL, CreateUserData } from "@/constants/api";
import { useState } from "react";

// Mismo patrón que useGetUsers.tsx: el hook guarda la lógica, la pantalla solo dibuja.
export function usePostUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveUser = async (userData: CreateUserData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status} al crear el usuario`);
      }

      await response.json();
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveUser, loading, error };
}
```

**Las tres piezas de un POST:**
1. `method: "POST"` → "no estoy pidiendo: estoy **creando**".
2. `headers: { "Content-Type": "application/json" }` → le avisás al servidor qué tipo de dato le mandás.
3. `body: JSON.stringify(userData)` → el cable solo entiende texto, así que convertís el objeto a JSON.

El hook **devuelve `true` o `false`** para que la pantalla sepa si salió bien.

---

## 🪜 Paso 7 — Pantalla para crear: `app/create-user.tsx`

Creá **`app/create-user.tsx`** (en `expo-router`, cada archivo dentro de `app/` es una pantalla):

```tsx
import { usePostUser } from "@/hooks/usePostUser";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateUser() {
  const router = useRouter();
  const { saveUser, loading } = usePostUser();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !username.trim() || !email.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const success = await saveUser({ name: name.trim(), username: username.trim(), email: email.trim() });
    if (success) {
      Alert.alert("¡Éxito!", "Usuario creado correctamente");
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Usuario</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Juan Pérez" />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="juanp"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="juan@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Usuario</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, backgroundColor: "#f8f9fa", borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 24, fontWeight: "bold" },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#28a745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#94d3a2" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
```

**Qué mirar:**
- Cada campo es un **input controlado**: `value={name}` + `onChangeText={setName}`.
- Antes de enviar, se valida que no haya campos vacíos (`Alert.alert` muestra un cartel).
- Si el POST salió bien, `router.back()` **vuelve** a la pantalla anterior.
- Mientras se envía, el botón se desactiva y muestra un spinner.

### Y ahora el botón en la lista

Abrí **`app/index.tsx`** y hacé **estos 4 cambios**:

1. Arriba, agregá el import: `import { useRouter } from "expo-router";`
2. En el import de `react-native`, agregá `TouchableOpacity`.
3. Adentro del componente `Index`, **primera línea**:
   ```tsx
   const router = useRouter();

   const handleGoToCreate = () => {
     router.push("/create-user");
   };
   ```
4. En el `header`, **debajo del título**, el botón (y en `StyleSheet` agregá `addButton` / `addButtonText`, y `flexDirection: "row"`, `justifyContent: "space-between"` al `header`):
   ```tsx
   <TouchableOpacity style={styles.addButton} onPress={handleGoToCreate}>
     <Text style={styles.addButtonText}>+ Nuevo Usuario</Text>
   </TouchableOpacity>
   ```

> Si preferís, **copiá el `index.tsx` completo** de la sección siguiente.

<details>
<summary>📄 <code>app/index.tsx</code> final (con el botón)</summary>

```tsx
import { UserCard } from "@/components/UserCard";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  // destructuracion de objetos
  const { error, getUsers, loading, users } = useGetUsers();

  const handleGoToCreate = () => {
    router.push("/create-user");
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo conectar: {error}</Text>
        <Button title="Reintentar" onPress={getUsers} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de usuarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleGoToCreate}>
          <Text style={styles.addButtonText}>+ Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5d5da3" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <UserCard user={item} />}
          refreshing={loading}
          onRefresh={getUsers}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No hay usuarios disponibles.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  addButton: { backgroundColor: "#007bff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "rgb(207, 107, 107)", marginBottom: 10, textAlign: "center" },
});
```

</details>

Y verificá que **`app/_layout.tsx`** sea:

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

---

## 🏁 Prueba final

1. Tocá **"+ Nuevo Usuario"**, completá los tres campos y **Crear Usuario**.
2. Aparece "¡Éxito!" y volvés a la lista.
3. El usuario nuevo **está guardado en el servidor** (abrí `server/db.json` y vas a ver un registro nuevo al final).
4. En la lista, **arrastrá hacia abajo** para refrescar y vas a verlo.

> 💡 La lista **no se actualiza sola** al volver. Es normal en esta clase: `useEffect(..., [])` pide los datos **una sola vez**. En la Clase 06 lo resolvemos.

---

## 🆘 Si algo no anda

| Qué pasa | Por qué | Qué hacer |
| :--- | :--- | :--- |
| **Queda cargando para siempre** | Server con `npm run dev`, IP mal escrita, o PC y celular en distinta wifi | `npm run start`; revisá `ipconfig`; misma wifi |
| Aparece "No se pudo conectar: Network request failed" | El celular no llega a la PC | Probá `http://TU_IP:3000/users` en el navegador **del celular**. Si no abre, es la red o el firewall |
| `Error 404 en el servidor` | URL mal escrita | Revisá `constants/api.ts` |
| La lista sale vacía ("No hay usuarios disponibles") | El server no tiene datos | Revisá `server/db.json` |
| El usuario nuevo no aparece | La lista no se refresca sola | Arrastrá hacia abajo (pull-to-refresh) |
| `Cannot find module '@/hooks/useGetUsers'` | Carpeta o archivo mal nombrado | Debe ser `hooks/useGetUsers.tsx` (respetá mayúsculas) |
| La app dice "Unable to resolve" al crear la pantalla | Archivo fuera de la carpeta `app/` | Tiene que estar en `app/create-user.tsx` |
| Cambié la IP y no se nota | Metro tiene cache | Cortá con Ctrl+C y corré `npx expo start -c` |

---

## 🌟 Para animarte (opcional)

1. **DELETE:** agregá un botón para eliminar un usuario (`method: "DELETE"` a `/users/ID`).
2. **Más campos:** agregá `phone` al formulario (ya existe en `CreateUserData`).
3. **Validar el email** antes de enviar (que contenga `@`).

---

## 📚 Lo que aprendiste

- Qué es una **API REST**, los verbos **GET/POST** y los códigos de estado.
- Pedir datos con **`fetch` + `async/await`**, con **loading** y **error**.
- Mostrar listas con **`FlatList`** y refrescarlas con *pull-to-refresh*.
- Enviar datos con **POST** (`method`, `headers`, `body`).
- **Separar la lógica en hooks** propios: la pantalla dibuja, el hook trabaja.

---

**➡️ Próxima clase (06):** vamos a optimizar esta misma app con `useMemo`, `useCallback`, `useRef` y `React.memo`, y a hacer que la lista se actualice sola. Guardá tu proyecto: seguimos sobre él.
