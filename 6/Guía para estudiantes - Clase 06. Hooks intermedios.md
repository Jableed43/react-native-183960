# ⚡ Clase 06 — Hooks intermedios: que tu app trabaje menos (Guía para estudiantes)

Hoy tu app de usuarios **ya funciona**. Vamos a hacer que funcione **mejor**: que no repita trabajo de más, que no haga pedidos al servidor sin necesidad y que la lista **se actualice sola** al volver de crear un usuario.

- **Partís de:** tu app de la Clase 05 (lista de usuarios + pantalla para crear usuario, con `useGetUsers` y `usePostUser`). No se crea un proyecto nuevo.
- **Terminás con:** un buscador optimizado con `useMemo`, funciones estables con `useCallback`, un `useRef`, `React.memo` en las tarjetas y refresco automático con `useFocusEffect`.
- **Tiempo estimado:** 90 a 120 minutos.

---

## 🗺️ Mapa de la guía

| Paso | Qué hacés | Hook / herramienta | Archivo |
| :---: | :--- | :--- | :--- |
| 1 | Buscador (a propósito sin optimizar) | `useState` | `app/index.tsx` |
| 2 | Filtro que no se recalcula de más | `useMemo` | `app/index.tsx` |
| 3 | Función estable para pedir datos | `useCallback` | `hooks/useGetUsers.tsx` |
| 4 | Contador silencioso y botón estable | `useRef`, `useCallback` | `components/UseRefExample.tsx`, `app/index.tsx` |
| 5 | Formulario y tarjetas eficientes | `useCallback`, `React.memo` | `app/create-user.tsx`, `hooks/usePostUser.tsx`, `components/UserCard.tsx` |
| 6 | Lista que se actualiza sola al volver | `useFocusEffect` | `app/index.tsx` |

---

## 🧠 La teoría que necesitás

### 1. Igualdad referencial (la raíz de todo)
En JavaScript `{} === {}` es **`false`**: dos objetos que "se ven iguales" son **dos cosas distintas en memoria**. Con las funciones pasa igual.

Todo lo que escribís **adentro** de un componente (variables, objetos, funciones) se **crea de nuevo en cada render**. Aunque el código sea idéntico, es una "versión nueva". Eso, que parece inofensivo, genera dos problemas: **trabajo repetido** y **bucles infinitos**.

### 2. `useMemo` — memorizar un **valor**
> "No calcules lo mismo dos veces."

Ejecuta una función, **guarda el resultado** y solo lo recalcula si cambian sus **dependencias**.

```tsx
const valor = useMemo(() => calculo(a, b), [a, b]);
```

### 3. `useCallback` — memorizar una **función**
> "Mantené la misma función entre renders."

```tsx
const miFuncion = useCallback(() => { ... }, [dependencias]);
```

No es para ahorrar código: es para que la función tenga **identidad estable** (siempre "la misma" en memoria).

| | `useMemo` | `useCallback` |
| :--- | :--- | :--- |
| Devuelve | el **resultado** (número, lista, objeto) | la **función misma** |
| Sirve para | evitar cálculos caros | evitar bucles y renders por identidad |

> **Truco para recordarlo:** `useCallback(fn, [x])` es lo mismo que `useMemo(() => fn, [x])`.

### 4. `useRef` — la memoria silenciosa
Un valor que **se recuerda entre renders pero NO redibuja la pantalla** cuando cambia.

| | `useState` | `useRef` |
| :--- | :--- | :--- |
| Se lee | directo | con `.current` |
| Se cambia | con `setX(...)` | asignando: `ref.current = ...` |
| ¿Redibuja? | **Sí** | **No** |

Analogía: `useState` es un **pizarrón** que todos ven; `useRef` es un **cuaderno privado** del componente.

### 5. `React.memo` — que un componente hijo no se redibuje de más
Si las **props** de un componente no cambiaron, `memo` evita volver a dibujarlo. Funciona bien junto con `useCallback` y `useMemo`: así las props mantienen su identidad.

### 6. Composición lógica
Cada capa tiene un trabajo: el **hook** maneja los datos y la red; el **componente** solo dibuja.

---

## ✅ Antes de empezar

1. API prendida: en `server`, **`npm run start`** (no `dev`).
2. App prendida: `npx expo start`.
3. `IP_LOCAL` en `constants/api.ts` = tu IP actual (`ipconfig`).
4. Chequeo: la app lista usuarios y "+ Nuevo Usuario" crea uno.

> En todos los pasos: después de cada cambio **probá la app** antes de seguir.

---

## 🪜 Paso 1 — Agregar un buscador (sin optimizar)

Primero hacemos que funcione, **a propósito sin optimizar**, para después ver la diferencia.

En **`app/index.tsx`**:

1. Imports: agregá `useState` a React y `TextInput` a `react-native`.
2. Debajo del `useGetUsers()`:

```tsx
const [search, setSearch] = useState("");

// Sin useMemo: esta función se vuelve a ejecutar en CADA render,
// aunque "users" y "search" sigan siendo los mismos.
const getFilteredUsers = () => {
  if (!search.trim()) return users;
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
};
```

3. En el JSX, **entre el `header` y la lista**:

```tsx
<View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="Buscar usuario..."
    value={search}
    onChangeText={setSearch}
  />
</View>
```

4. En el `FlatList`: `data={getFilteredUsers()}`.
5. En `StyleSheet`:

```tsx
searchContainer: { padding: 10, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
searchInput: { height: 40, backgroundColor: "#f1f3f5", borderRadius: 8, paddingHorizontal: 15 },
```

✅ **Comprobá:** escribís en el buscador y la lista se filtra por nombre o email.

> 🤔 **Problema escondido:** `getFilteredUsers()` filtra **toda la lista en cada render**, incluso cuando nada relevante cambió (por ejemplo, al volver a esta pantalla). Con 10 usuarios no se nota; con 10.000 sí.

---

## 🪜 Paso 2 — `useMemo` en el filtro

En `app/index.tsx`:

1. Importá `useMemo` de React.
2. **Reemplazá** `getFilteredUsers` por:

```tsx
// useMemo: recalcula el filtro solo si cambian "users" o "search".
const filteredUsers = useMemo(() => {
  if (!search.trim()) return users;
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
}, [users, search]);
```

3. En el `FlatList`: `data={filteredUsers}` (sin paréntesis: ya no es una función, es un **valor**).

**El array `[users, search]` son las dependencias:** si ninguna cambió desde el último render, React **reutiliza el resultado guardado**.

✅ **Comprobá:** el buscador sigue funcionando igual. La diferencia es interna.

---

## 🪜 Paso 3 — `useCallback` en `useGetUsers`

En **`hooks/useGetUsers.tsx`**, hoy `getUsers` se crea de nuevo en cada render. Si quisiéramos ponerla como dependencia de un `useEffect`, el efecto correría **en cada render → bucle infinito de pedidos al servidor**.

La solución:

1. Importá `useCallback`: `import { useCallback, useEffect, useState } from "react";`
2. Envolvé `getUsers`:

```tsx
// useCallback: sin esto, getUsers se crea de nuevo en CADA render,
// y si la incluimos como dependencia del useEffect de abajo, entramos en bucle infinito.
const getUsers = useCallback(async () => {
  // ... el mismo cuerpo de siempre (try / catch / finally) ...
}, []);
```

3. Y el `useEffect` ahora puede (y debe) declarar la dependencia:

```tsx
useEffect(() => {
  getUsers();
}, [getUsers]); // ahora es seguro: getUsers no cambia entre renders
```

El `[]` del `useCallback` significa "esta función **nunca** cambia". Funciona porque adentro solo usa `setUsers`, `setLoading` y `setError`, que React garantiza estables.

> ⚠️ **Regla:** si la función usa una variable o estado de afuera, **esa variable tiene que ir en el array** de dependencias; si no, la función trabaja con un valor viejo ("stale closure").

✅ **Comprobá:** la lista carga una sola vez; el pull-to-refresh sigue funcionando.

---

## 🪜 Paso 4 — `useRef`: verlo funcionando

### 4.1 Demo aislada

Creá **`components/UseRefExample.tsx`**:

```tsx
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Demo aislada para VER la diferencia entre useState y useRef antes de tocar
 * el código real. No forma parte de la app final: se saca al terminar el Paso 4.
 */
const UseRefExample = () => {
  // 1. Estado tradicional (dispara re-render)
  const [renderCount, setRenderCount] = useState(0);

  // 2. Ref (NO dispara re-render)
  const silentCounter = useRef(0);

  const incrementRef = () => {
    silentCounter.current += 1;
    console.log("Valor del Ref (en consola):", silentCounter.current);
    // El número sube en la consola, ¡pero en la pantalla no!
  };

  const forceRender = () => {
    setRenderCount(renderCount + 1);
    // Al cambiar el estado, el componente se redibuja y "descubrimos"
    // el valor actual que tenía el Ref.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useRef vs useState</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Contador con Ref (silencioso):</Text>
        <Text style={styles.value}>{silentCounter.current}</Text>
        <TouchableOpacity style={styles.buttonRef} onPress={incrementRef}>
          <Text style={styles.buttonText}>Incrementar Ref</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Mirá la consola: el Ref cambia pero la pantalla no.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Renderizados totales:</Text>
        <Text style={[styles.value, { color: "#007AFF" }]}>{renderCount}</Text>
        <TouchableOpacity style={styles.buttonState} onPress={forceRender}>
          <Text style={styles.buttonText}>Forzar Render (useState)</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Al presionar esto, el valor del Ref se actualiza en pantalla.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5", borderRadius: 15, margin: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: { fontSize: 16, color: "#333" },
  value: { fontSize: 32, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
  buttonRef: { backgroundColor: "#34C759", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonState: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  hint: { fontSize: 12, color: "#666", marginTop: 8, fontStyle: "italic" },
});

export default UseRefExample;
```

Y mostralo **temporalmente** en `app/index.tsx`, debajo del buscador:

```tsx
import UseRefExample from "@/components/UseRefExample";
// ...
<UseRefExample />
```

**Probalo en este orden:**
1. Tocá **"Incrementar Ref"** varias veces. En la **consola** el número sube, pero **en pantalla se queda en 0**. El ref cambió, pero nadie redibujó.
2. Tocá **"Forzar Render (useState)"**. Ahora sí la pantalla se redibuja y **aparece de golpe** el valor real del ref.

Conclusión: `useRef` guarda datos **sin disparar render**. Sirve para contadores internos, timers, referencias a inputs, valores de depuración.

### 4.2 Usarlo "en serio" en la app

Sacá `<UseRefExample />` y su import (la demo ya cumplió). En `app/index.tsx`, agregá `useRef` al import de React y:

```tsx
// useRef: memoria silenciosa. Cambiarla NO dispara un re-render.
const renderCount = useRef(0);
renderCount.current++;
```

Y en el `header`, debajo del título:

```tsx
<View>
  <Text style={styles.title}>Lista de usuarios</Text>
  <Text style={styles.renderText}>Renders: {renderCount.current}</Text>
</View>
```

```tsx
// en StyleSheet:
renderText: { fontSize: 12, color: "#666", fontStyle: "italic" },
```

✅ **Comprobá:** escribí en el buscador y mirá cómo sube el contador de **Renders**. Cada letra redibuja la pantalla; el contador usa `useRef` justamente para **no provocar un render extra** al incrementarse.

### 4.3 `useCallback` para el botón de navegación

```tsx
// useCallback: identidad estable para el botón de navegación.
const handleGoToCreate = useCallback(() => {
  router.push("/create-user");
}, [router]);
```

(`router` va en las dependencias porque la función lo usa.)

---

## 🪜 Paso 5 — Formulario, `usePostUser` y `React.memo`

### 5.1 `handleSubmit` en `app/create-user.tsx`

Importá `useCallback` y envolvé la función:

```tsx
const handleSubmit = useCallback(async () => {
  if (!name.trim() || !username.trim() || !email.trim()) {
    Alert.alert("Error", "Todos los campos son obligatorios");
    return;
  }

  const success = await saveUser({ name: name.trim(), username: username.trim(), email: email.trim() });
  if (success) {
    Alert.alert("¡Éxito!", "Usuario creado correctamente");
    router.back();
  }
}, [name, username, email, saveUser, router]);
```

Las dependencias son **todo lo que la función lee de afuera**: `name`, `username`, `email`, `saveUser`, `router`. Si falta una, `handleSubmit` enviaría datos viejos.

### 5.2 `saveUser` en `hooks/usePostUser.tsx`

Como en el Paso 3: importá `useCallback` y envolvé `saveUser`:

```tsx
const saveUser = useCallback(async (userData: CreateUserData) => {
  // ... el mismo cuerpo de siempre ...
}, []);
```

### 5.3 `React.memo` en `components/UserCard.tsx`

```tsx
import React, { memo } from "react";

export const UserCard = memo(({ user }: UserCardProps) => (
  <View style={styles.userItem}>
    <Text style={styles.userName}>{user.name}</Text>
    <Text style={styles.userEmail}>{user.email}</Text>
  </View>
));
```

Ahora, si `user` es el mismo objeto que en el render anterior, **`UserCard` no se vuelve a ejecutar**. Combinado con el filtro estable (Paso 2) y las funciones estables (Pasos 3 y 4), la pantalla se redibuja sin reprocesar las tarjetas.

✅ **Comprobá:** crear un usuario sigue funcionando. Nada se ve distinto: la mejora es interna.

---

## 🪜 Paso 6 — Que la lista se actualice sola al volver (`useFocusEffect`)

Probá esto: creá un usuario y volvé. **No aparece** hasta que arrastrás la lista hacia abajo. ¿Por qué?

`useEffect` corre **una sola vez**, cuando la pantalla se crea. Pero con navegación en pila (`Stack`), la lista **nunca se destruye**: queda "debajo" de la pantalla de crear. Al volver no se vuelve a crear, entonces no se vuelve a ejecutar.

La herramienta correcta es **`useFocusEffect`**: corre **cada vez que la pantalla vuelve a estar en primer plano**.

En `app/index.tsx`:

```tsx
import { useFocusEffect, useRouter } from "expo-router";   // ← de expo-router
```

```tsx
// Se ejecuta cada vez que esta pantalla gana foco: al abrirla y también
// al volver desde create-user (a diferencia de useEffect, que solo corre una vez).
useFocusEffect(
  useCallback(() => {
    getUsers();
  }, [getUsers])
);
```

> ⚠️ **Solo funciona después del Paso 3.** Si `getUsers` no estuviera en `useCallback`, cambiaría en cada render, el efecto se volvería a disparar y la app **pediría datos sin parar**. Es el ejemplo perfecto de por qué importa la igualdad referencial.

✅ **Comprobá:** creá un usuario → volvés → **aparece solo**, sin arrastrar.

---

## 🔍 Archivo final de referencia

<details>
<summary>📄 <code>app/index.tsx</code> terminado</summary>

```tsx
import { UserCard } from "@/components/UserCard";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  // destructuracion de objetos
  const { error, getUsers, loading, users } = useGetUsers();
  const [search, setSearch] = useState("");

  // Se ejecuta cada vez que esta pantalla gana foco: al abrirla y también
  // al volver desde create-user (a diferencia de useEffect, que solo corre una vez).
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [getUsers])
  );

  // useRef: memoria silenciosa. Cambiarla NO dispara un re-render.
  const renderCount = useRef(0);
  renderCount.current++;

  // useMemo: recalcula el filtro solo si cambian "users" o "search".
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // useCallback: identidad estable para el botón de navegación.
  const handleGoToCreate = useCallback(() => {
    router.push("/create-user");
  }, [router]);

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
        <View>
          <Text style={styles.title}>Lista de usuarios</Text>
          <Text style={styles.renderText}>Renders: {renderCount.current}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleGoToCreate}>
          <Text style={styles.addButtonText}>+ Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5d5da3" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
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
  renderText: { fontSize: 12, color: "#666", fontStyle: "italic" },
  addButton: { backgroundColor: "#007bff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  searchContainer: { padding: 10, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  searchInput: { height: 40, backgroundColor: "#f1f3f5", borderRadius: 8, paddingHorizontal: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "rgb(207, 107, 107)", marginBottom: 10, textAlign: "center" },
});
```

</details>

<details>
<summary>📄 <code>hooks/useGetUsers.tsx</code> terminado</summary>

```tsx
import { API_URL, User } from "@/constants/api";
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

      const response = await fetch(`${API_URL}`);
      // response.ok -> es un booleano, si salió bien la operación es true
      if (!response.ok) {
        throw new Error(`Error ${response.status} en el servidor`);
      }
      // convierte la respuesta en objeto de js para poder procesarlo
      const data: User[] = await response.json();

      setUsers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      // ya sea que haya salido bien o mal la operacion siempre lo ultimo ejecutado es finally
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

</details>

<details>
<summary>📄 <code>hooks/usePostUser.tsx</code> terminado</summary>

```tsx
import { API_URL, CreateUserData } from "@/constants/api";
import { useCallback, useState } from "react";

export function usePostUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback: mantiene la misma referencia entre renders, útil si algún día
  // se usa como dependencia de otro hook o se pasa a un componente memoizado.
  const saveUser = useCallback(async (userData: CreateUserData) => {
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
  }, []);

  return { saveUser, loading, error };
}
```

</details>

<details>
<summary>📄 <code>app/create-user.tsx</code> terminado</summary>

```tsx
import { usePostUser } from "@/hooks/usePostUser";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
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

  // useCallback: identidad estable para el botón de envío.
  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !username.trim() || !email.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const success = await saveUser({ name: name.trim(), username: username.trim(), email: email.trim() });
    if (success) {
      Alert.alert("¡Éxito!", "Usuario creado correctamente");
      router.back();
    }
  }, [name, username, email, saveUser, router]);

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

</details>

<details>
<summary>📄 <code>components/UserCard.tsx</code> terminado</summary>

```tsx
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { User } from "@/constants/api";

interface UserCardProps {
  user: User;
}

// React.memo: si "user" es el mismo objeto que en el render anterior,
// UserCard NO se vuelve a ejecutar. Junto con useCallback en el padre,
// evita re-renderizar los 10, 50 o 100 items de la lista sin necesidad.
export const UserCard = memo(({ user }: UserCardProps) => (
  <View style={styles.userItem}>
    <Text style={styles.userName}>{user.name}</Text>
    <Text style={styles.userEmail}>{user.email}</Text>
  </View>
));

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

</details>

---

## 🏆 Reglas de oro

1. **`useState`** si el usuario tiene que **ver** el cambio. **`useRef`** si el cambio es interno.
2. **No memorices todo.** `useMemo` y `useCallback` también tienen un costo. Usalos cuando el cálculo es caro o cuando necesitás identidad estable (dependencia de otro hook, prop de un componente con `memo`).
3. **Dependencias completas:** todo lo que la función usa de afuera va en el array.

---

## 🆘 Si algo no anda

| Qué pasa | Por qué | Qué hacer |
| :--- | :--- | :--- |
| **La app pide datos sin parar / se cuelga** | Una función como dependencia de `useEffect` o `useFocusEffect` sin `useCallback` | Envolvé esa función en `useCallback` (Paso 3) |
| **Queda cargando para siempre** | Server con `npm run dev`, IP mal escrita, o distinta wifi | `npm run start`; revisá `ipconfig` |
| El contador **Renders** no se mueve | Solo sube cuando algo redibuja la pantalla | Escribí en el buscador |
| `handleSubmit` envía datos viejos | Falta una variable en las dependencias | Revisá `[name, username, email, saveUser, router]` |
| Crear usuario y volver no actualiza la lista | Falta el Paso 6, o `useFocusEffect` importado de otro lado | Importalo de **`expo-router`** y revisá que estés editando **el proyecto que realmente está corriendo** |
| Error de TypeScript con `useFocusEffect` | Falta el `import` | `import { useFocusEffect, useRouter } from "expo-router"` |
| En el **navegador** aparece `useLinkPreviewContext must be used within…` | Problema conocido de `expo-router` en **web**, no de tu código | Probá en el celular con Expo Go |

---

## 🌟 Para animarte (opcional)

1. **`memo` con comparación propia:** `memo(UserCard, (prev, next) => prev.user.id === next.user.id)`.
2. **Debounce con `useRef`:** guardá un `setTimeout` en un ref y filtrá recién 300 ms después de que el usuario deja de tipear.
3. **`useUpdateUser`:** armá un hook para editar usuarios (PATCH) con el mismo patrón que `usePostUser`.

---

## 📚 Lo que aprendiste

- **Igualdad referencial:** por qué lo que se crea dentro del componente "cambia" en cada render.
- **`useMemo`** (valores) y **`useCallback`** (funciones), y cuándo usar cada uno.
- **`useRef`:** memoria que no redibuja.
- **`React.memo`:** evitar redibujar hijos sin cambios.
- **`useFocusEffect`:** ejecutar algo cada vez que volvés a una pantalla.
- **Composición lógica:** el hook trabaja, el componente dibuja.

---

**➡️ Próxima clase (07):** le damos **modo claro y oscuro** a esta misma app con Context API. Guardá tu proyecto: seguimos sobre él.
