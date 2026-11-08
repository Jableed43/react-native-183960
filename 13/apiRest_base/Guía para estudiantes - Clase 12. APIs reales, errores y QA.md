# 🔌 Guía para estudiantes - Clase 12: APIs reales, errores y QA

**Qué vas a lograr hoy:** tu app de usuarios deja de ser "anda si todo sale bien" y pasa a ser una app que **aguanta fallas**: mensajes claros cuando se cae el servidor, formulario con validaciones, **editar** y **borrar** usuarios (CRUD completo) y una **lista de bugs** que vos mismo/a encontraste y arreglaste.

> **Punto de partida:** tu app terminada de la Clase 11 (login, pestañas, drawer, notas, usuarios). Si no la tenés, copiá `apiRest_base`.
> **Material de apoyo:** [Plantilla de QA y reporte de bugs](Plantilla%20de%20QA%20y%20reporte%20de%20bugs.md).

---

## 🗺️ Mapa de la clase

| # | Qué hacemos | Resuelve |
| :-: | :--- | :--- |
| 1 | Probar la app y anotar bugs (QA) | Encontrarlos antes que el usuario |
| 2 | La URL de la API va al `.env` | La IP cambia y la lista se queda cargando |
| 3 | Una **capa de servicio** | Errores en inglés / técnicos |
| 4 | Formulario con validaciones + **editar** + **borrar** | Email inválido, error en silencio, CRUD incompleto |
| 5 | Volver a probar y cerrar el reporte | Comprobar que todo quedó bien |
| 6 | Demo: cambiar de API con una línea | Entender por qué `.env` + servicio |

---

## 🧰 Comandos que vas a usar (y para qué sirven)

| Comando | Qué hace |
| :--- | :--- |
| `npm run start` (en la carpeta `server`) | Enciende la API de prueba (`json-server`) accesible desde el celular |
| `npx expo start` | Enciende la app (QR) |
| `npx expo start -c` | Igual, pero **borra la caché**. Hay que usarlo cada vez que cambiás el `.env` |
| `npx tsc --noEmit` | Revisa los tipos de todo el proyecto **sin generar nada**. **0 errores = bien** |
| `ipconfig` | Muestra la IP de tu PC (buscá *Dirección IPv4*) |

---

## 🧪 Paso 1: Probar la app y anotar los bugs (15 min)

Abrí la [Plantilla de QA](Plantilla%20de%20QA%20y%20reporte%20de%20bugs.md) y hagamos estas **pruebas de rotura** en la app **tal cual está** (todavía no cambies código):

1. **Apagá el servidor** (`Ctrl+C` en su terminal) y recargá la lista de usuarios. ¿Qué mensaje aparece?
2. **Creá un usuario** con el email `hola`. ¿Lo acepta?
3. Con el servidor apagado, tocá **Crear Usuario**. ¿Qué pasa?
4. Buscá cómo **editar** o **borrar** un usuario.
5. Si podés, **cambiá de red** (o reconectá la PC) y fijate si la lista sigue cargando.

Anotá cada problema en una tabla como esta (la plantilla trae una vacía):

| ID | Qué pasó | Pasos para reproducir | Esperado vs obtenido | Prioridad | Cómo se arregla |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **B1** | Al fallar la red aparece un texto técnico en inglés | Apagar el servidor y recargar la lista | Esperado: un mensaje claro. Obtenido: `No se pudo conectar: Network request failed` | 🟡 Media | Capa de servicio con mensajes para personas (Paso 3) |
| **B2** | Se acepta cualquier texto como email | Crear usuario con email `hola` | Esperado: error. Obtenido: se crea igual | 🟡 Media | Validar en el formulario (Paso 4) |
| **B3** | Crear usuario **falla en silencio** | Apagar el servidor, tocar "Crear Usuario" | Esperado: avisar el error. Obtenido: no pasa nada y no se sabe por qué | 🔴 Alta | Mostrar el error en un `Alert` (Paso 4) |
| **B4** | No se puede **editar ni borrar** un usuario | Buscar un botón para editar o borrar | Esperado: poder hacerlo. Obtenido: no existe (CRUD incompleto) | 🟡 Media | Completar el CRUD (Paso 4) |
| **B5** | La app deja de traer datos cuando cambia la red | Cambiar de wifi / reconectar la PC | Esperado: sigue funcionando. Obtenido: lista cargando para siempre (la IP está escrita en el código) | 🔴 Alta | La URL va en el `.env` (Paso 2) |

> 💡 **Ninguno es "la app explota"**: son los detalles que separan una app de práctica de una app entregable. **Prioridad:** 🔴 rompe la experiencia → 🟡 se usa mal → 🟢 cosmético. Arreglamos primero los 🔴.

---

## ⚙️ Paso 2: La URL de la API va al `.env` (arregla B5)

**Problema:** la IP de la PC estaba escrita en el código (`IP_LOCAL`). Cuando cambió, la lista dejó de cargar.

**1.** Averiguá tu IP: `ipconfig` → *Dirección IPv4* (por ejemplo `192.168.1.38`).

**2.** En el archivo `.env` (el mismo donde están las claves de Firebase) agregá una línea. **Sin barra `/` al final**:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.38:3000
```

**3.** Reemplazá **todo** el contenido de `features/users/api.ts`:

```ts
// URL base de la API. Sale del archivo .env (variable EXPO_PUBLIC_API_URL): así, cambiar de
// servidor, de IP o de API no obliga a tocar el código. Si falta, usa localhost
// (que solo sirve en la web o en un emulador, NO en un celular real).
// El replace saca las barras del final por si alguien escribió "http://...:3000/".
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
```

**4.** Reiniciá con la caché limpia (Expo lee el `.env` solo al arrancar):

```bash
npx expo start -c
```

> **¿Por qué `EXPO_PUBLIC_`?** Es el prefijo que deja pasar la variable a la app. Sin él, vale `undefined`. Y ya no hace falta distinguir Android de iPhone (antes `localhost` no funcionaba en un iPhone).

✅ **Chequeo:** la lista carga igual que antes. Verificá: `npx tsc --noEmit` → sin errores.

> ⚠️ Si tenés más archivos que importaban `IP_LOCAL` de `api.ts`, `tsc` te lo va a marcar: ahora todos usan `API_URL`.

---

## 🧱 Paso 3: Capa de servicio (arregla B1)

**Idea:** hoy cada hook hace su propio `fetch`. Vamos a tener **un único archivo** que sabe hablar con la API, y que convierte cualquier falla en un **mensaje que una persona entienda**.

> **Dato clave:** `fetch` **no falla** con un 404 o un 500 (solo falla si no hay red). Por eso siempre hay que mirar `response.ok`.

**3.1 — Archivo nuevo `features/users/usersService.ts`:**

```ts
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
```

Cómo leerlo (de abajo hacia arriba): las **5 funciones** del final son el CRUD, una línea cada una → todas usan `request` → `request` hace el `fetch` y tiene **dos controles**: si `fetch` falla, *no hay conexión*; si `response.ok` es falso, *el servidor respondió con error*. En ambos casos lanza un `Error` con un mensaje claro (`messageForStatus` traduce 404, 500… a una frase).

**3.2 — Reemplazá `features/users/useGetUsers.tsx`:**

```tsx
import { User } from "@/features/users/api";
import { fetchUsers } from "@/features/users/usersService";
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
      // Antes acá estaba todo el fetch. Ahora lo hace la capa de servicio.
      setUsers(await fetchUsers());
    } catch (error) {
      // El servicio ya arma un mensaje claro para la persona.
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]); // ahora es seguro incluirla: getUsers no cambia entre renders

  return { users, loading, error, getUsers };
}
```

**3.3 — Archivos nuevos (mismo patrón: `loading`, `error` y una función):**

`features/users/useGetUser.tsx` (trae **un** usuario por id):

```tsx
import { User } from "@/features/users/api";
import { fetchUser } from "@/features/users/usersService";
import { useEffect, useState } from "react";

// Trae UN usuario por su id (GET /users/:id). Se usa en la pantalla de edición.
export function useGetUser(id: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true; // si la pantalla se cierra antes de que llegue la respuesta, no actualizamos nada

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUser(id);
        if (active) setUser(data);
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  return { user, loading, error };
}
```

`features/users/useUpdateUser.tsx`:

```tsx
import { UpdateUserData } from "@/features/users/api";
import { updateUser } from "@/features/users/usersService";
import { useCallback, useState } from "react";

// Mismo patrón que usePostUser: loading + error + una función que devuelve null (ok) o el mensaje de error.
export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editUser = useCallback(async (id: number, data: UpdateUserData): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      await updateUser(id, data);
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  }, []);

  return { editUser, loading, error };
}
```

`features/users/useDeleteUser.tsx`:

```tsx
import { deleteUser } from "@/features/users/usersService";
import { useCallback, useState } from "react";

// Mismo patrón otra vez: loading + error + una función que devuelve null (ok) o el mensaje de error.
export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeUser = useCallback(async (id: number): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      await deleteUser(id);
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  }, []);

  return { removeUser, loading, error };
}
```

> ⚠️ **No cambies todavía `usePostUser.tsx`**: va en el Paso 4 **junto con** `create-user.tsx` (devuelve otra cosa y tienen que cambiar a la vez).

✅ **Chequeo:** `npx tsc --noEmit` sin errores. Con el servidor **apagado**, recargá la lista: ahora dice *"No se pudo conectar con el servidor…"* y un botón **Reintentar**. Prendé el servidor y tocá Reintentar.

---

## ✏️ Paso 4: Formulario, editar y borrar (arregla B2, B3 y B4)

**4.1 — Archivo nuevo `shared/confirmAction.ts`** (el "¿Seguro?" antes de borrar):

```ts
import { Alert, Platform } from "react-native";

/**
 * Pide confirmación antes de una acción que no se puede deshacer (por ejemplo, borrar).
 * En el celular usa el cartel nativo (Alert); en el navegador, window.confirm
 * (porque Alert.alert no hace nada en la web).
 */
export function confirmAction(title: string, message: string, onConfirm: () => void, confirmText = "Eliminar") {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    { text: confirmText, style: "destructive", onPress: onConfirm },
  ]);
}
```

**4.2 — Archivo nuevo `features/users/UserForm.tsx`.** Un formulario **reutilizable**: sirve para crear (vacío) y para editar (con datos). Valida que los campos obligatorios estén y que el email tenga formato válido:

```tsx
import { CreateUserData } from "@/features/users/api";
import { useTheme } from "@/features/theme/ThemeContext";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface UserFormProps {
  initialValues?: CreateUserData; // si viene, el formulario arranca con estos datos (modo "editar")
  submitLabel: string; // texto del botón: "Crear usuario" / "Guardar cambios"
  loading: boolean; // mientras se envía, el botón se desactiva
  onSubmit: (data: CreateUserData) => void; // se llama SOLO si los datos son válidos
}

type Errors = Partial<Record<"name" | "username" | "email", string>>;

// Un email "válido" para este curso: algo + @ + algo + . + algo (ej: ana@mail.com)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulario de usuario REUTILIZABLE: lo usan "Nuevo usuario" y "Editar usuario".
 * Antes cada pantalla tenía su propio formulario; ahora hay uno solo y las validaciones viven acá.
 */
export function UserForm({ initialValues, submitLabel, loading, onSubmit }: UserFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [username, setUsername] = useState(initialValues?.username ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const result: Errors = {};
    if (!name.trim()) result.name = "El nombre es obligatorio";
    if (!username.trim()) result.username = "El username es obligatorio";
    if (!email.trim()) result.email = "El email es obligatorio";
    else if (!EMAIL_REGEX.test(email.trim())) result.email = "Ingresá un email válido (ej: ana@mail.com)";
    return result;
  };

  const handleSubmit = () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return; // hay errores: no enviamos nada
    onSubmit({ name: name.trim(), username: username.trim(), email: email.trim() });
  };

  // Los inputs comparten colores; el borde pasa a rojo si el campo tiene error.
  const inputStyle = (field: keyof Errors) => [
    styles.input,
    {
      backgroundColor: colors.inputBackground,
      borderColor: errors[field] ? colors.error : colors.inputBorder,
      color: colors.inputText,
    },
  ];

  return (
    <View style={styles.form}>
      <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
      <TextInput
        style={inputStyle("name")}
        value={name}
        onChangeText={setName}
        placeholder="Juan Pérez"
        placeholderTextColor={colors.textDisabled}
      />
      {errors.name && <Text style={[styles.error, { color: colors.error }]}>{errors.name}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Username</Text>
      <TextInput
        style={inputStyle("username")}
        value={username}
        onChangeText={setUsername}
        placeholder="juanp"
        placeholderTextColor={colors.textDisabled}
        autoCapitalize="none"
      />
      {errors.username && <Text style={[styles.error, { color: colors.error }]}>{errors.username}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Email</Text>
      <TextInput
        style={inputStyle("email")}
        value={email}
        onChangeText={setEmail}
        placeholder="juan@mail.com"
        placeholderTextColor={colors.textDisabled}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={[styles.error, { color: colors.error }]}>{errors.email}</Text>}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: loading ? colors.successDisabled : colors.success }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.onPrimary }]}>{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 12 },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16 },
  error: { fontSize: 13, marginTop: 6 },
  button: { height: 50, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 24 },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});
```

**4.3 — Reemplazá `features/users/usePostUser.tsx` y `app/create-user.tsx` a la vez** (ahora el hook devuelve `null` si salió bien o el **mensaje de error**):

```tsx
import { CreateUserData } from "@/features/users/api";
import { createUser } from "@/features/users/usersService";
import { useCallback, useState } from "react";

export function usePostUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Devuelve null si salió bien, o el mensaje de error si falló.
  // Así la pantalla puede mostrárselo a la persona en el momento (antes fallaba en silencio).
  const saveUser = useCallback(async (userData: CreateUserData): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      await createUser(userData);
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveUser, loading, error };
}
```

```tsx
import { useTheme } from "@/features/theme/ThemeContext";
import { CreateUserData } from "@/features/users/api";
import { usePostUser } from "@/features/users/usePostUser";
import { UserForm } from "@/features/users/UserForm";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateUser() {
  const router = useRouter();
  const { saveUser, loading } = usePostUser();
  const { colors } = useTheme();

  // El formulario ya validó los datos; acá solo los enviamos y avisamos cómo salió.
  const handleSubmit = useCallback(
    async (data: CreateUserData) => {
      const errorMessage = await saveUser(data);
      if (errorMessage) {
        // Antes, si el servidor fallaba, no pasaba nada y la persona no sabía por qué.
        Alert.alert("No se pudo crear el usuario", errorMessage);
        return;
      }
      Alert.alert("¡Éxito!", "Usuario creado correctamente");
      router.back();
    },
    [saveUser, router]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Nuevo Usuario</Text>
      </View>

      <UserForm submitLabel="Crear Usuario" loading={loading} onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
});
```

**4.4 — Archivo nuevo `app/edit-user.tsx`** (recibe el `id` por la ruta y carga el usuario antes de mostrar el formulario):

```tsx
import { useTheme } from "@/features/theme/ThemeContext";
import { CreateUserData } from "@/features/users/api";
import { useGetUser } from "@/features/users/useGetUser";
import { useUpdateUser } from "@/features/users/useUpdateUser";
import { UserForm } from "@/features/users/UserForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditUser() {
  const router = useRouter();
  const { colors } = useTheme();
  // El id llega por la ruta: router.push({ pathname: "/edit-user", params: { id } })
  // Los parámetros de ruta siempre llegan como texto, por eso Number(...)
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = Number(id);

  const { user, loading: loadingUser, error: loadError } = useGetUser(userId);
  const { editUser, loading: saving } = useUpdateUser();

  const handleSubmit = useCallback(
    async (data: CreateUserData) => {
      const errorMessage = await editUser(userId, data);
      if (errorMessage) {
        Alert.alert("No se pudo guardar", errorMessage);
        return;
      }
      Alert.alert("¡Listo!", "Usuario actualizado");
      router.back();
    },
    [editUser, userId, router]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Editar Usuario</Text>
      </View>

      {loadingUser ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : loadError || !user ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.error }]}>{loadError ?? "No se encontró el usuario"}</Text>
        </View>
      ) : (
        // Mostramos el formulario recién cuando el usuario ya llegó, así arranca con sus datos.
        <UserForm
          initialValues={{ name: user.name, username: user.username, email: user.email }}
          submitLabel="Guardar cambios"
          loading={saving}
          onSubmit={handleSubmit}
        />
      )}
    </SafeAreaView>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  errorText: { fontSize: 16, textAlign: "center" },
});
```

**4.5 — Reemplazá `features/users/UserCard.tsx`** (suma los botones ✏️ y 🗑️):

```tsx
import { User } from "@/features/users/api";
import { useTheme } from "@/features/theme/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface UserCardProps {
  user: User;
  index: number; // posición en la lista: sirve para escalonar la animación de entrada
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// React.memo evita re-renders por cambios de PROPS, pero NO bloquea los de Context:
// si cambia el tema, UserCard se vuelve a pintar igual (y es lo que queremos).
// Las funciones onEdit / onDelete vienen con useCallback desde la pantalla (Clase 06),
// por eso memo sigue sirviendo: sus props no cambian en cada render.
export const UserCard = memo(({ user, index, onEdit, onDelete }: UserCardProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 70).springify()}
      style={[styles.userItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      <View style={styles.info}>
        <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(user)} accessibilityLabel={`Editar a ${user.name}`}>
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(user)} accessibilityLabel={`Eliminar a ${user.name}`}>
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

// Los estilos fijos (tamaños, márgenes) quedan acá; los colores vienen del theme.
const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    gap: 12,
  },
  info: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { marginTop: 4 },
  actions: { flexDirection: "row", gap: 16 },
  actionIcon: { fontSize: 20 },
});
```

**4.6 — Registrá la pantalla nueva en `app/_layout.tsx`.** Buscá la línea de `create-user` (dentro del **primer** `Stack.Protected`, el de `guard={!!user}`) y agregá la de `edit-user` justo debajo:

```tsx
<Stack.Screen name="create-user" options={{ title: "Nuevo usuario" }} />
<Stack.Screen name="edit-user" options={{ title: "Editar usuario" }} />  {/* NUEVA */}
```

> Tu `<Stack.Screen name="create-user" ...>` puede estar escrito en varias líneas: no importa, solo agregá la línea nueva al lado.

**4.7 — `app/(drawer)/(tabs)/index.tsx`: 6 cambios chicos.** Hacelos en orden:

**Cambio 1** — buscá esto:

```tsx
import { UserCard } from "@/features/users/UserCard";
import { useTheme } from "@/features/theme/ThemeContext";
import { useGetUsers } from "@/features/users/useGetUsers";
```

y reemplazalo por esto:

```tsx
import { UserCard } from "@/features/users/UserCard";
import { useTheme } from "@/features/theme/ThemeContext";
import { User } from "@/features/users/api";
import { useDeleteUser } from "@/features/users/useDeleteUser";
import { useGetUsers } from "@/features/users/useGetUsers";
import { confirmAction } from "@/shared/confirmAction";
```

**Cambio 2** — buscá esto:

```tsx
import {
  ActivityIndicator,
  Button,
```

y reemplazalo por esto:

```tsx
import {
  ActivityIndicator,
  Alert,
  Button,
```

**Cambio 3** — buscá esto:

```tsx
  const { error, getUsers, loading, users } = useGetUsers();
```

y reemplazalo por esto:

```tsx
  const { error, getUsers, loading, users } = useGetUsers();
  const { removeUser } = useDeleteUser();
```

**Cambio 4** — buscá esto:

```tsx
  if (error) {
```

y reemplazalo por esto:

```tsx
  // useCallback: la tarjeta usa memo, así que estas funciones tienen que mantener su identidad.
  const handleEdit = useCallback(
    (user: User) => {
      router.push({ pathname: "/edit-user", params: { id: String(user.id) } });
    },
    [router]
  );

  const handleDelete = useCallback(
    (user: User) => {
      // Borrar no se puede deshacer: primero pedimos confirmación.
      confirmAction("Eliminar usuario", `¿Seguro que querés eliminar a ${user.name}?`, async () => {
        const errorMessage = await removeUser(user.id);
        if (errorMessage) {
          Alert.alert("No se pudo eliminar", errorMessage);
          return;
        }
        getUsers(); // volvemos a pedir la lista para que ya no aparezca
      });
    },
    [removeUser, getUsers]
  );

  if (error) {
```

**Cambio 5** — buscá esto:

```tsx
<Text style={[styles.errorText, { color: colors.error }]}>No se pudo conectar: {error}</Text>
```

y reemplazalo por esto:

```tsx
<Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
```

**Cambio 6** — buscá esto:

```tsx
renderItem={({ item, index }) => <UserCard user={item} index={index} />}
```

y reemplazalo por esto:

```tsx
renderItem={({ item, index }) => (
            <UserCard user={item} index={index} onEdit={handleEdit} onDelete={handleDelete} />
          )}
```


✅ **Chequeo (B2, B3, B4):**
1. `npx tsc --noEmit` → sin errores.
2. Crear usuario con email `hola` → **avisa** y no envía.
3. Crear usuario con el servidor apagado → **aparece el error**.
4. Tocá ✏️ → el formulario aparece **con los datos**; guardá y la lista muestra el cambio.
5. Tocá 🗑️ → pide confirmación. **Cancelar** no borra; **Eliminar** sí.

---

## 🔁 Paso 5: Volver a probar y cerrar el reporte

Repetí el checklist de la [Plantilla de QA](Plantilla%20de%20QA%20y%20reporte%20de%20bugs.md). Pasá cada bug de tu tabla a **✅ Resuelto**. Si alguno no se pudo arreglar, anotá por qué (eso también es QA).

**Commits chicos, uno por arreglo** (cuándo usar cada prefijo está en la plantilla):

```bash
git add -A
git commit -m "fix: mover la URL de la API al .env"

git add -A
git commit -m "refactor: centralizar las llamadas a la API en un servicio"

git add -A
git commit -m "feat: editar y eliminar usuarios, con validación del formulario"
```

---

## 🎭 Paso 6 (Demo): cambiar de API editando una línea

En el `.env` comentá tu línea y probá una API pública:

```bash
# EXPO_PUBLIC_API_URL=http://192.168.1.38:3000
EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

Reiniciá con `npx expo start -c`. Misma app, **otros datos** (10 usuarios de una API real). Ahora **creá un usuario**: sale "¡Éxito!"... y **no aparece** en la lista.

> **¿Qué pasó?** *JSONPlaceholder* responde `201 Created` pero **no guarda nada**: es una API de práctica. Moraleja de QA: **comprobá que el dato quedó guardado**, no solo que no hubo error. Y pudimos cambiar de backend sin tocar código porque la URL está en el `.env` y las llamadas en un solo archivo. **Volvé a poner tu línea original** al terminar.

---

## 📁 Cómo tiene que quedar tu proyecto

```text
features/users/
├── api.ts              ← URL base (.env) + tipos
├── usersService.ts     ← ÚNICO lugar que habla con la API (NUEVO)
├── useGetUsers.tsx     ← lista            (usa el servicio)
├── useGetUser.tsx      ← uno por id       (NUEVO)
├── usePostUser.tsx     ← crear            (usa el servicio)
├── useUpdateUser.tsx   ← editar           (NUEVO)
├── useDeleteUser.tsx   ← borrar           (NUEVO)
├── UserForm.tsx        ← formulario compartido (NUEVO)
└── UserCard.tsx        ← con ✏️ y 🗑️
shared/confirmAction.ts ← "¿Seguro?" antes de borrar (NUEVO)
app/edit-user.tsx       ← pantalla de edición (NUEVA)
```

Para comprobar que están todos, en la raíz de la app:

```bash
dir features\users, shared, app\edit-user.tsx /b
```

---

## 🆘 Si algo falla

| Síntoma | Causa | Solución |
| :--- | :--- | :--- |
| La lista sigue cargando después de editar el `.env` | Expo no recargó las variables | `Ctrl+C` y `npx expo start -c` |
| "No se pudo conectar con el servidor" con el server prendido | IP mal o cambió | `ipconfig` y corregí `EXPO_PUBLIC_API_URL` (sin `/` al final) |
| Anda en la web pero no en el celu | `localhost` en el celu es el propio celu | Usá la IP de la PC en el `.env` |
| Crear usuario "no hace nada" | `usePostUser` y `create-user.tsx` quedaron desparejos | Cambiá **los dos** (4.3) |
| El formulario de edición sale vacío | Se mostró antes de que llegara el usuario | Usá `edit-user.tsx` tal cual (4.4) |
| `No route named "edit-user"` | Falta registrar la pantalla | Paso 4.6 |
| Error de TypeScript en `index.tsx` por `onEdit`/`onDelete` | `UserCard` y `index` desparejos | Aplicá los 6 cambios (4.7) y el 4.5 |
| 🗑️ no hace nada en el navegador | `Alert.alert` no existe en la web | Por eso existe `confirmAction` (4.1) |
| Con la API pública el usuario creado no aparece | Es una API de práctica | No es tu código (Paso 6) |

---

## 🌟 Desafíos opcionales
1. Al borrar, sacar el usuario de la lista **antes** de que responda el servidor (y devolverlo si falla).
2. Agregar un **tiempo máximo de espera** a `request()` con `AbortController` (si el servidor no responde, hoy la app queda cargando).
3. Reescribir `request()` con `axios` y comparar.
4. Paginación: `GET /users?_page=1&_limit=5` y un botón "Ver más".
5. Ordenar/filtrar desde el servidor: `?_sort=name&_order=asc`, `?q=ana`.
6. Hacer la tabla de bugs de **tu proyecto final** con la plantilla.

**Tarea:** aplicá la plantilla de QA a tu proyecto y traé tu tabla de bugs.
