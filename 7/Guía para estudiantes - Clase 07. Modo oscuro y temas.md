# 🎨 Clase 07 — Modo oscuro y temas para tu app (Guía para estudiantes)

En esta guía vas a hacer que tu app de usuarios tenga **modo claro y modo oscuro**, con un botón 🌙/☀️ que cambia **toda** la app a la vez.

- **Partís de:** tu app de la Clase 06 (lista de usuarios con buscador, crear usuario, `useMemo`, `useCallback`, `React.memo`). No se crea un proyecto nuevo.
- **Terminás con:** una app que cambia de tema en todas las pantallas, con los colores guardados **en un solo lugar**.
- **Tiempo estimado:** 60 a 75 minutos.

---

## 🗺️ Mapa de la guía

| Paso | Qué hacés | Archivo |
| :---: | :--- | :--- |
| 1 | Paleta de colores clara y oscura | `constants/theme.ts` (nuevo) |
| 2 | Provider y hook `useTheme` | `context/ThemeContext.tsx` (nuevo) |
| 3 | Conectar el Provider, header y `StatusBar` | `app/_layout.tsx` |
| 4 | Pantalla principal y botón 🌙/☀️ | `app/index.tsx` |
| 5 | Tarjetas de usuario | `components/UserCard.tsx` |
| 6 | Formulario de crear usuario | `app/create-user.tsx` |

---

## 🧠 La idea en 2 minutos

**Problema:** hoy los colores (`"#fff"`, `"#666"`, `"#eee"`) están escritos a mano en cada archivo. Para hacer un modo oscuro tendrías que cambiarlos **todos** y, encima, hacer que cambien al tocar un botón.

**Solución, en dos piezas:**

1. **Un archivo de colores** (`theme.ts`) con dos paletas: una clara y una oscura. Los colores tienen nombre por **función** (`background`, `text`, `primary`), no por color (`azul`, `gris2`).
2. **Context API:** una forma de guardar el tema actual en **un lugar central** y leerlo desde cualquier pantalla **sin pasar props** de componente en componente.

| Pieza de Context | Qué hace | Analogía |
| :--- | :--- | :--- |
| `createContext` | Crea el canal | La antena |
| `Provider` | Envuelve la app y **emite** el tema | La radio que transmite |
| `useContext` | Un componente **lee** el tema | El que escucha |

Nosotros vamos a esconder `useContext` dentro de un hook propio, **`useTheme()`**, igual que hiciste con `useGetUsers`. Así en cada pantalla alcanza con:

```tsx
const { colors, toggleTheme } = useTheme();
```

---

## ✅ Antes de empezar (checklist)

1. **API prendida.** En la carpeta `server`, corré **`npm run start`** (no `npm run dev`).
   > ⚠️ Con `npm run dev` el servidor solo escucha dentro de la PC y **tu celular se queda cargando para siempre**. Siempre `npm run start`.
2. **App prendida.** En la carpeta de tu app: `npx expo start` y abrila en el celular con Expo Go.
3. **Tu IP.** En `constants/api.ts` revisá que `IP_LOCAL` sea la IPv4 actual de tu PC (`ipconfig` en CMD → "Dirección IPv4"). Celular y PC tienen que estar en la **misma red wifi**.
4. **Chequeo de partida:** la app abre, muestra usuarios, el buscador filtra y "+ Nuevo Usuario" funciona. Todo está en blanco: es lo esperado.

### 📱 Un ajuste en `constants/api.ts` (recomendado)

En un celular, `localhost` es **el propio celular**, no tu PC. Para que funcione en Android **y** iPhone, cambiá el `BASE_URL`:

```ts
// En un celular "localhost" es el propio celular, no tu PC:
// por eso en nativo se usa la IP de la PC; "localhost" solo sirve en web.
const BASE_URL =
  Platform.OS === "web"
    ? `http://localhost:3000`
    : `http://${IP_LOCAL}:3000`;
```

---

## 🪜 Paso 1 — Crear la paleta de colores

Creá el archivo **`constants/theme.ts`** (la carpeta `constants` ya existe):

```ts
// Paleta por función, no por color: "primary", "background", "error"...
// Un objeto por tema. Los dos tienen EXACTAMENTE las mismas claves.
export const lightColors = {
  // Fondos
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",

  // Textos
  text: "#333333",
  textSecondary: "#666666",
  textDisabled: "#999999",

  // Acciones y estados
  primary: "#007AFF",
  success: "#28A745",
  successDisabled: "#94D3A2",
  error: "#FF3B30",
  onPrimary: "#FFFFFF", // texto sobre botones de color

  // Bordes e inputs
  border: "#E0E0E0",
  inputBackground: "#F5F5F5",
  inputBorder: "#DDDDDD",
  inputText: "#333333",
};

// "Colors" = la forma que tiene que cumplir cualquier tema.
// Si falta una clave en darkColors, TypeScript avisa al instante.
export type Colors = typeof lightColors;

export const darkColors: Colors = {
  background: "#000000",
  surface: "#1C1C1E",
  card: "#2C2C2E",

  text: "#FFFFFF",
  textSecondary: "#EBEBF5",
  textDisabled: "#8E8E93",

  primary: "#0A84FF",
  success: "#32D74B",
  successDisabled: "#1E5A2B",
  error: "#FF453A",
  onPrimary: "#FFFFFF",

  border: "#38383A",
  inputBackground: "#1C1C1E",
  inputBorder: "#38383A",
  inputText: "#FFFFFF",
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
```

**Qué mirar:**
- `lightColors` y `darkColors` tienen **las mismas claves**. `darkColors: Colors` hace que TypeScript te avise en rojo si te olvidás de una.
- `onPrimary` es el color del texto que va **sobre** un botón de color.

✅ **Comprobá:** corré `npx tsc --noEmit` en la terminal. No debería marcar errores.

---

## 🪜 Paso 2 — Crear el Provider y el hook `useTheme`

Creá la carpeta **`context`** (al lado de `hooks` y `components`) y adentro el archivo **`context/ThemeContext.tsx`**:

```tsx
import { Colors, darkColors, lightColors } from "@/constants/theme";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colors: Colors;
  toggleTheme: () => void;
}

// undefined = "nadie me proveyó": lo usamos para detectar el error en useTheme.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // useCallback (Clase 6): toggleTheme mantiene la misma identidad entre renders.
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // useMemo (Clase 6): sin esto, "value" es un objeto nuevo en cada render del Provider
  // y TODOS los consumidores se re-renderizan aunque el tema no haya cambiado.
  const value = useMemo(
    () => ({ theme, colors: theme === "light" ? lightColors : darkColors, toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook propio (composición lógica otra vez): los componentes no conocen useContext ni ThemeContext.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un <ThemeProvider>");
  }
  return context;
}
```

**Qué mirar:**
- El único estado es `theme` (`"light"` o `"dark"`). Los `colors` **se calculan** a partir de `theme`; no son otro estado.
- `useCallback` y `useMemo` son los de la Clase 06: sin ellos, `value` sería un objeto nuevo en cada render y **toda la app** se volvería a dibujar sin necesidad.
- `useTheme` lanza un error claro si lo usás **fuera** del Provider.

---

## 🪜 Paso 3 — Conectar el Provider a la app

Reemplazá todo el contenido de **`app/_layout.tsx`**:

```tsx
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Este componente existe porque useTheme solo funciona DENTRO del Provider.
// RootLayout es quien lo monta, así que no puede consumirlo a la vez.
function RootLayoutNav() {
  const { theme, colors } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Usuarios" }} />
        <Stack.Screen name="create-user" options={{ title: "Nuevo usuario" }} />
      </Stack>
      {/* Fondo oscuro -> íconos claros, y viceversa */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
```

**¿Por qué hay dos componentes?** `useTheme()` solo funciona **dentro** del Provider. `RootLayout` es quien lo pone, así que no puede usarlo a la vez; por eso el resto va en `RootLayoutNav`.

También configuramos el **header** del `Stack` y el **`StatusBar`** (reloj y batería del celular): con fondo oscuro tienen que verse claros.

✅ **Comprobá:** la app abre y ahora el header dice "Usuarios". Todavía no hay botón para cambiar de tema.

---

## 🪜 Paso 4 — Pantalla principal con botón de tema

Reemplazá todo **`app/index.tsx`**:

```tsx
import { UserCard } from "@/components/UserCard";
import { useTheme } from "@/context/ThemeContext";
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
  // Context API: leemos el tema global sin recibir ninguna prop.
  const { theme, colors, toggleTheme } = useTheme();

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
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>No se pudo conectar: {error}</Text>
        <Button title="Reintentar" onPress={getUsers} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Lista de usuarios</Text>
          <Text style={[styles.renderText, { color: colors.textSecondary }]}>Renders: {renderCount.current}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeButtonText}>{theme === "light" ? "🌙" : "☀️"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleGoToCreate}>
            <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>+ Nuevo Usuario</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.inputBackground, color: colors.inputText }]}
          placeholder="Buscar usuario..."
          placeholderTextColor={colors.textDisabled}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
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
              <Text style={{ color: colors.textSecondary }}>No hay usuarios disponibles.</Text>
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 22, fontWeight: "bold" },
  renderText: { fontSize: 12, fontStyle: "italic" },
  themeButton: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  themeButtonText: { fontSize: 18 },
  addButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { fontWeight: "600" },
  searchContainer: { padding: 10, borderBottomWidth: 1 },
  searchInput: { height: 40, borderRadius: 8, paddingHorizontal: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { marginBottom: 10, textAlign: "center" },
});
```

**Lo que cambió respecto a tu versión:**
1. Importamos `useTheme` y leemos `{ theme, colors, toggleTheme }`.
2. Cada color fijo pasó a ser `colors.algo`, **al final** del array de estilos: `style={[styles.title, { color: colors.text }]}`. En un array gana el último.
3. Apareció el botón `🌙/☀️` que llama a `toggleTheme`.
4. El buscador tiene `placeholderTextColor`; si no, el texto de ayuda no se lee en modo oscuro.
5. En `StyleSheet.create` **ya no hay colores**, solo tamaños y márgenes.

> Si tu `index.tsx` es un poco distinto al de la clase pasada (por ejemplo, sin el contador `Renders`), no pasa nada: lo importante son los puntos 1 a 5. Aplicalos sobre tu versión.

✅ **Comprobá:** tocá 🌙. Cambian el fondo, el header, el buscador y los botones. Las tarjetas de usuarios siguen blancas: es lo próximo.

---

## 🪜 Paso 5 — Las tarjetas de usuario

Reemplazá **`components/UserCard.tsx`**:

```tsx
import { User } from "@/constants/api";
import { useTheme } from "@/context/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface UserCardProps {
  user: User;
}

// React.memo evita re-renders por cambios de PROPS, pero NO bloquea los de Context:
// si cambia el tema, UserCard se vuelve a pintar igual (y es lo que queremos).
export const UserCard = memo(({ user }: UserCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.userItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
      <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
    </View>
  );
});

// Los estilos fijos (tamaños, márgenes) quedan acá; los colores vienen del theme.
const styles = StyleSheet.create({
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    marginTop: 4,
  },
});
```

> 🤔 **Pregunta para pensar:** `UserCard` usa `React.memo`, que evita redibujar cuando las props no cambian. ¿Entonces por qué las tarjetas **sí** cambian de color al tocar 🌙?
> **Respuesta:** `memo` mira las **props**, pero un componente que usa un Context se vuelve a dibujar **cuando cambia ese Context**. Y es justo lo que queremos.

✅ **Comprobá:** al tocar 🌙, las tarjetas también cambian.

---

## 🪜 Paso 6 — El formulario de crear usuario

Reemplazá **`app/create-user.tsx`**:

```tsx
import { useTheme } from "@/context/ThemeContext";
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
  const { colors } = useTheme();

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

  // Los 3 inputs comparten los mismos colores: los armamos una sola vez.
  const inputThemeStyle = {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Nuevo Usuario</Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
        <TextInput
          style={[styles.input, inputThemeStyle]}
          value={name}
          onChangeText={setName}
          placeholder="Juan Pérez"
          placeholderTextColor={colors.textDisabled}
        />

        <Text style={[styles.label, { color: colors.text }]}>Username</Text>
        <TextInput
          style={[styles.input, inputThemeStyle]}
          placeholderTextColor={colors.textDisabled}
          value={username}
          onChangeText={setUsername}
          placeholder="juanp"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, inputThemeStyle]}
          placeholderTextColor={colors.textDisabled}
          value={email}
          onChangeText={setEmail}
          placeholder="juan@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: loading ? colors.successDisabled : colors.success }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Crear Usuario</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});
```

**Detalle útil:** los tres `TextInput` comparten colores, así que se arma `inputThemeStyle` **una sola vez** y se reutiliza.

✅ **Comprobá final:** poné modo oscuro, entrá a "Nuevo Usuario" (sigue oscuro), creá uno y volvé (la lista lo muestra y sigue oscura).

---

## 🔍 Revisión final

- [ ] Hay un botón 🌙/☀️ y cambia **toda** la app.
- [ ] Las pantallas "Lista" y "Nuevo usuario" respetan el tema.
- [ ] Buscá `#` en `app/` y `components/` (Ctrl+Shift+F): **solo** debería aparecer en `constants/theme.ts`. Si queda un color suelto, esa parte se ve mal en modo oscuro.
- [ ] `npx tsc --noEmit` sin errores.

---

## 🆘 Si algo no anda

| Qué pasa | Por qué | Qué hacer |
| :--- | :--- | :--- |
| **La app se queda cargando y nunca muestra usuarios** | El server se prendió con `npm run dev`, o `IP_LOCAL` está mal, o se usa `localhost` en un celular | `npm run start` en `server`; revisar `ipconfig`; aplicar el ajuste de `BASE_URL` de arriba |
| `useTheme debe usarse dentro de un <ThemeProvider>` | Usaste `useTheme()` fuera del Provider | Que el componente esté dentro de `ThemeProvider` (como `RootLayoutNav`) |
| No se lee el texto del buscador o del placeholder | Falta `color` o `placeholderTextColor` | Revisar el Paso 4 |
| Una pantalla se queda blanca en modo oscuro | Quedó un color escrito a mano | Buscar `#` en ese archivo y cambiarlo por `colors.…` |
| El reloj/batería no se ven | `StatusBar` fijo | Ver el Paso 3 |
| Al recargar la app vuelve al modo claro | Es normal: el tema vive en memoria | Guardarlo para siempre lo vemos en la Clase 09 |
| El cartel "¡Éxito!" o el teclado se ven con otro color | Siguen el modo del **celular**, no tu botón | No es un error de tu código |
| `Cannot find module '@/context/ThemeContext'` | La carpeta o el archivo está mal escrito | Debe ser `context/ThemeContext.tsx` (mayúsculas incluidas) |

---

## 🌟 Para animarte (opcional)

1. Cambiá `primary` en **los dos** temas y mirá cómo cambian todos los botones sin tocar nada más.
2. Usá `spacing` (ya exportado en `theme.ts`) en lugar de `padding: 20`.
3. Hacé que el tema inicial dependa del celular: `useState<Theme>(useColorScheme() ?? "light")` (importando `useColorScheme` de `react-native`).
4. Pensá: ¿dónde guardarías la preferencia para que **no se pierda** al cerrar la app? (Pista: Clase 09).

---

## 📚 Lo que aprendiste

- **Theme:** los estilos viven en un solo lugar y se nombran por función.
- **Context API:** `createContext` + `Provider` + `useContext`, para compartir datos sin pasar props.
- **Hook propio (`useTheme`):** esconde los detalles y valida el uso correcto.
- **Estilos dinámicos:** `[estilosFijos, { color: colors.algo }]`, el último gana.
- **Todo lo de la Clase 06 sigue sirviendo:** `useMemo`/`useCallback` evitan que el Provider redibuje la app sin motivo.

---

**➡️ Próxima clase (08):** usamos el hardware del celular (cámara, ubicación y más). Guardá tu proyecto.
