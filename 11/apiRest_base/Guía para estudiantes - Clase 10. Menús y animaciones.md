# 🧭 Clase 10 — Menús y animaciones (Guía para estudiantes)

Hasta hoy tu app era una lista y un formulario. Hoy se convierte en una app de verdad: **pestañas abajo**, **menú lateral** y **animaciones** que la hacen sentir viva.

- **Partís de:** tu app de la Clase 09 (usuarios, notas con Firebase, modo oscuro). Es la misma app, no un proyecto nuevo.
- **Terminás con:** un menú lateral con "Inicio" y "Mi perfil", dos pestañas (Usuarios y Notas) y animaciones de entrada y de salida. Además te llevás un **catálogo de efectos** para seguir probando por tu cuenta.
- **Tiempo estimado:** 90 a 120 minutos.

---

## 🗺️ Mapa de la guía

| Paso | Qué hacés | Archivos |
| :---: | :--- | :--- |
| 0 | Preparar el proyecto | `package.json` |
| 1 | Entender el mapa de navegación | — |
| 2 | Pestañas (Tabs) | `app/(tabs)/_layout.tsx`, `app/_layout.tsx` |
| 3 | Menú lateral (Drawer) | `app/(drawer)/_layout.tsx`, `app/_layout.tsx` |
| 4 | Pantalla "Mi perfil" | `app/(drawer)/profile.tsx` (nuevo) |
| 5 | Animación 1: tarjetas en cascada | `components/UserCard.tsx` |
| 6 | Animación 2: notas que salen y se reacomodan | `components/NoteItem.tsx`, `notes.tsx` |
| 7 | ⭐ Extra: botones que rebotan | `components/PressableScale.tsx` (nuevo) |
| 🎨 | **Catálogo de efectos**: qué hay, qué hace y cuándo usarlo | — |

---

## 🧠 La teoría que necesitás

### Tres formas de moverse por una app

| Navegador | Idea | Ejemplo real | Cuándo usarlo |
| :--- | :--- | :--- | :--- |
| **Stack** (pila) | Una pantalla **encima** de otra; se vuelve con "atrás" | Lista → Detalle → Formulario | Flujos paso a paso (ya lo usás) |
| **Tabs** (pestañas) | Secciones **siempre a mano**, abajo | Instagram, WhatsApp | 2 a 5 secciones principales |
| **Drawer** (menú lateral) | Un panel que sale del costado | Gmail, Spotify | Muchas secciones, o las secundarias (perfil, ajustes) |

### Anidar = meter un navegador dentro de otro
En `expo-router` **las carpetas son la navegación**. Cada carpeta con un archivo `_layout.tsx` decide qué navegador la maneja, y cada archivo de esa carpeta es una pantalla.

- Una carpeta **con paréntesis** — `(drawer)`, `(tabs)` — es un **grupo**: organiza la navegación pero **no aparece en la ruta**. Por eso `/notes` sigue siendo `/notes`.
- Hoy armamos **Stack ⊃ Drawer ⊃ Tabs**:

```
app/
├── _layout.tsx              ← Stack raíz (+ ThemeProvider + GestureHandlerRootView)
├── create-user.tsx          ← se apila ENCIMA de todo (con flecha para volver)
└── (drawer)/
    ├── _layout.tsx          ← Menú lateral (Drawer)
    ├── profile.tsx          ← Mi perfil
    └── (tabs)/
        ├── _layout.tsx      ← Barra de pestañas (Tabs)
        ├── index.tsx        ← pestaña Usuarios
        └── notes.tsx        ← pestaña Notas
```

### Animaciones que no se traban
- React Native tiene **dos hilos**: el de JavaScript (tu lógica) y el de la **UI** (el que dibuja). **Reanimated** hace correr las animaciones en el hilo de UI, por eso son fluidas.
- Hay **tres niveles** de dificultad: (1) una opción del navegador (`animation: "fade"`), (2) **presets** de una línea (`entering={FadeInDown}`), (3) una animación **a medida** (`useSharedValue` + `withSpring`).
- **`withSpring`** imita un resorte (rebota, se siente natural); **`withTiming`** dura un tiempo fijo (más mecánico).
- Una **microinteracción** es una reacción pequeña al toque (el botón se achica un poco). Reglas: **sutil**, **consistente** y **con propósito**. Si todo se mueve, marea.

---

## 🪜 Paso 0 — Preparar el proyecto

1. Abrí tu proyecto de la Clase 09 (o la carpeta `apiRest_base` que te pasa el profe).
2. Instalá el menú lateral **si tu proyecto no lo trae** (con `expo install`, nunca `npm install`):

```bash
npx expo install @react-navigation/drawer
```

> `react-native-gesture-handler` y `react-native-reanimated` ya vienen en el proyecto. Si Expo se queja por versiones: `npx expo install --fix`.

3. Prendé el servidor de usuarios (`npm run start` en la carpeta `server`) y la app (`npx expo start`).

✅ **Comprobá:** la app abre con la lista de usuarios, como la dejaste en la clase pasada.

---

## 🪜 Paso 1 — El mapa de navegación

Esto es lo que vamos a construir:

```
Stack
 ├── Drawer ─┬── Inicio ── Tabs ─┬── Usuarios
 │           │                   └── Notas
 │           └── Mi perfil
 └── Nuevo usuario
```

Y así arranca tu carpeta `app/` hoy:

```
app/
├── _layout.tsx
├── index.tsx        ← lista de usuarios
├── notes.tsx        ← notas en la nube (Firebase)
└── create-user.tsx
```

---

## 🪜 Paso 2 — Pestañas (Tabs)

1. Creá la carpeta **`app/(tabs)`** (con los paréntesis) y **movele** `index.tsx` y `notes.tsx` (arrastrá los archivos en VS Code). Queda así:

```
app/
├── _layout.tsx
├── create-user.tsx
└── (tabs)/
    ├── _layout.tsx      ← NUEVO: la barra de pestañas
    ├── index.tsx        ← (movido)
    └── notes.tsx        ← (movido)
```

2. Creá **`app/(tabs)/_layout.tsx`**:

```tsx
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.background },
        animation: "fade", // transición suave entre pestañas
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Usuarios",
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notas",
          tabBarIcon: ({ color, size }) => <Ionicons name="cloud-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

3. En **`app/_layout.tsx`**, dentro del `<Stack>`, reemplazá las pantallas `index` y `notes` por `(tabs)`:

```tsx
<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
<Stack.Screen name="create-user" options={{ title: "Nuevo usuario" }} />
```

4. En **`app/(tabs)/index.tsx`** **borrá** estas dos partes (ahora "Notas" es una pestaña, así que ya no hace falta el botón ☁️):

```tsx
// 1) BORRAR esta función:
const handleGoToNotes = useCallback(() => {
  router.push("/notes");
}, [router]);

// 2) BORRAR este botón del header (el que tiene el ☁️):
<TouchableOpacity
  style={[styles.themeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
  onPress={handleGoToNotes}
>
  <Text style={styles.themeButtonText}>☁️</Text>
</TouchableOpacity>
```

**Qué mirar:**
- **El nombre del archivo es el nombre de la pestaña:** `index.tsx` → `name="index"`. Si no coinciden, la pestaña no aparece o da error.
- El `(tabs)` va entre paréntesis → **no cambia la ruta**: "+ Nuevo Usuario" sigue funcionando sin tocar nada.
- Los colores salen del tema (`useTheme`): lo que armaste en la Clase 07 sigue sirviendo.

✅ **Comprobá:** abajo hay una barra con **Usuarios** y **Notas**; al cambiar de pestaña hay un *fade* suave. "+ Nuevo Usuario" abre el formulario y al volver aparece el usuario nuevo.

---

## 🪜 Paso 3 — Menú lateral (Drawer)

1. Creá la carpeta **`app/(drawer)`** y **movele adentro la carpeta `(tabs)` entera**.
2. Creá **`app/(drawer)/_layout.tsx`**:

```tsx
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

// Menú lateral. Cada <Drawer.Screen name="..."> apunta a una carpeta o archivo de esta carpeta:
//  - "(tabs)"  -> la carpeta (tabs), que tiene SU PROPIO navegador de pestañas (navegación anidada).
//  - "profile" -> el archivo profile.tsx
export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Mi perfil",
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Drawer>
  );
}
```

3. Reemplazá **`app/_layout.tsx`** completo (ahora el `Stack` apunta a `(drawer)` y todo se envuelve en `GestureHandlerRootView`):

```tsx
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Este componente existe porque useTheme solo funciona DENTRO del Provider.
function RootLayoutNav() {
  const { theme, colors } = useTheme();

  return (
    <>
      {/* Navegador RAÍZ: un Stack.
          - "(drawer)" es todo el menú lateral con sus pestañas (no muestra header del Stack).
          - "create-user" se apila ENCIMA del drawer, con su flecha para volver. */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="create-user" options={{ title: "Nuevo usuario" }} />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    // El Drawer detecta los deslizamientos con react-native-gesture-handler:
    // necesita este contenedor envolviendo toda la app.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
```

4. En **`app/(drawer)/(tabs)/_layout.tsx`** el header ahora lo muestra el Drawer, así que lo apagamos acá. **Reemplazá** estas dos líneas:

```tsx
headerStyle: { backgroundColor: colors.card },
headerTintColor: colors.text,
```
por esta:
```tsx
// El header ya lo muestra el Drawer (con el botón ☰): no lo repetimos acá.
headerShown: false,
```

Así queda tu carpeta `app/` al terminar este paso:

```
app/
├── _layout.tsx              ← Stack raíz (+ ThemeProvider + GestureHandlerRootView)
├── create-user.tsx          ← se apila ENCIMA de todo (con flecha para volver)
└── (drawer)/
    ├── _layout.tsx          ← Menú lateral (Drawer)
    ├── profile.tsx          ← Mi perfil
    └── (tabs)/
        ├── _layout.tsx      ← Barra de pestañas (Tabs)
        ├── index.tsx        ← pestaña Usuarios
        └── notes.tsx        ← pestaña Notas
```

**Qué mirar:**
- **Anidar fue mover una carpeta.** No hubo que reescribir las pestañas.
- **`GestureHandlerRootView`:** el Drawer detecta que deslizás con el dedo gracias a esta librería. Sin este contenedor **el gesto no funciona** (con el botón ☰ sí). Va una sola vez, en la raíz.
- En `Drawer.Screen`, `name="(tabs)"` es **el nombre de la carpeta, con paréntesis**.
- Si no hacés el punto 4, vas a ver **dos barras** arriba (la del Drawer y la de las pestañas): probalo para entender por qué hay que apagar una.
- "Nuevo usuario" sigue en el `Stack` raíz: se abre **encima** de todo, con su flecha para volver.

✅ **Comprobá:** arriba a la izquierda hay un botón **☰**. Tocalo, o **deslizá desde el borde izquierdo** de la pantalla: se abre el menú con **Inicio** y **Mi perfil** ("Mi perfil" todavía da error: falta el Paso 4). Las pestañas siguen abajo.

---

## 🪜 Paso 4 — La pantalla "Mi perfil"

Creá **`app/(drawer)/profile.tsx`**:

```tsx
import { useTheme } from "@/context/ThemeContext";
import { useStoredState } from "@/hooks/useStoredState";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

// Pantalla del menú lateral. Muestra tres animaciones de entrada distintas.
export default function Profile() {
  const { theme, colors, toggleTheme } = useTheme();
  // El mismo nombre que se guarda desde la pantalla de Notas (misma clave en AsyncStorage)
  const [author, setAuthor] = useStoredState("@apiRest:author", "");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ZoomIn: el avatar "crece" desde cero con un pequeño rebote */}
      <Animated.View
        entering={ZoomIn.springify()}
        style={[styles.avatar, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.avatarText, { color: colors.onPrimary }]}>{author.trim() ? author.trim()[0].toUpperCase() : "?"}</Text>
      </Animated.View>

      {/* Cada bloque entra un poquito después del anterior: delay escalonado */}
      <Animated.Text entering={FadeInDown.delay(150)} style={[styles.title, { color: colors.text }]}>
        Hola, {author.trim() || "invitado"} 👋
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Tu nombre</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText },
          ]}
          value={author}
          onChangeText={setAuthor}
          placeholder="Ej: Ana"
          placeholderTextColor={colors.textDisabled}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(450)}
        style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.rowText, { color: colors.text }]}>Modo oscuro</Text>
        <Switch value={theme === "dark"} onValueChange={toggleTheme} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Solo estructura: los colores se aplican arriba con useTheme().
  container: { flex: 1, alignItems: "center", padding: 24, gap: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, justifyContent: "center", alignItems: "center", marginTop: 24 },
  avatarText: { fontSize: 40, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold" },
  field: { alignSelf: "stretch" },
  label: { fontSize: 12, marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
  },
  rowText: { fontSize: 16 },
});
```

**Qué mirar:**
- Una pantalla nueva es **un archivo más** en la carpeta; ya está declarada en el menú (`Drawer.Screen name="profile"`).
- Reutiliza cosas que ya sabés: `useTheme` (Clase 07), `useStoredState` (Clase 09, la **misma clave** que el nombre de la pestaña Notas) y un `Switch` para el modo oscuro.
- Estrena `entering={...}` (lo explicamos en el próximo paso): cada bloque entra un poquito después del anterior.
- 🔬 **Probalo exagerado** (como hicimos en clase): cambiá `ZoomIn.springify()` por `ZoomIn.duration(5000)` y los `delay(150/300/450)` por `delay(1500/3000/4500)`. Vas a **ver** cada efecto en cámara lenta. Después dejalo sutil de nuevo (ver el *Catálogo de efectos*).

✅ **Comprobá:** "Mi perfil" abre la pantalla. El nombre que escribís acá aparece también en la pestaña **Notas**.

---

## 🪜 Paso 5 — Animación 1: tarjetas en cascada

1. Reemplazá **`components/UserCard.tsx`**:

```tsx
import { User } from "@/constants/api";
import { useTheme } from "@/context/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface UserCardProps {
  user: User;
  index: number; // posición en la lista: sirve para escalonar la animación de entrada
}

// React.memo evita re-renders por cambios de PROPS, pero NO bloquea los de Context:
// si cambia el tema, UserCard se vuelve a pintar igual (y es lo que queremos).
export const UserCard = memo(({ user, index }: UserCardProps) => {
  const { colors } = useTheme();

  return (
    // entering = animación de ENTRADA. FadeInDown: aparece subiendo desde abajo.
    // delay escalonado (efecto "cascada"): cada tarjeta espera un poquito más que la anterior.
    // Math.min evita que una lista larga tarde una eternidad en terminar de aparecer.
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 70).springify()}
      style={[styles.userItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
      <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
    </Animated.View>
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

2. En **`app/(drawer)/(tabs)/index.tsx`**, pasale el `index` a cada tarjeta:

```tsx
renderItem={({ item, index }) => <UserCard user={item} index={index} />}
```

**Qué mirar:**
- `Animated.View` es un `View` "animable" (viene de Reanimated).
- **`entering`** = cómo **aparece** el elemento. `FadeInDown` entra subiendo desde abajo; `.springify()` le suma rebote.
- **Cascada = `delay` según la posición:** cada tarjeta espera `index × 70` milisegundos. `Math.min(index, 8)` evita que una lista larga tarde una eternidad.
- `memo` sigue ahí: la animación no rompe lo que optimizaste en la Clase 06.

✅ **Comprobá:** las tarjetas **aparecen una tras otra**. Probá cambiar `70` por `300` para exagerar el efecto (¡y volvelo a `70`!).

---

## 🪜 Paso 6 — Animación 2: las notas entran, salen y se reacomodan

1. Reemplazá **`components/NoteItem.tsx`**:

```tsx
import { Note } from "@/constants/notes";
import { useTheme } from "@/context/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutRight } from "react-native-reanimated";

interface NoteItemProps {
  note: Note;
  onToggle: (note: Note) => void;
  onDelete: (id: string) => void;
}

// memo + funciones estables (useCallback en useNotes): la nota solo se redibuja si ella cambió.
export const NoteItem = memo(({ note, onToggle, onDelete }: NoteItemProps) => {
  const { colors } = useTheme();

  return (
    // entering = cómo APARECE una nota nueva; exiting = cómo DESAPARECE al borrarla.
    // Sin "exiting", la nota se esfumaría de golpe en el mismo instante en que se borra.
    <Animated.View
      entering={FadeInDown.springify()}
      exiting={FadeOutRight}
      style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
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
    </Animated.View>
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

2. En **`app/(drawer)/(tabs)/notes.tsx`**, cambiá la lista por `Animated.FlatList`:

```tsx
import Animated, { LinearTransition } from "react-native-reanimated";
// (sacá FlatList del import de "react-native")

<Animated.FlatList
  itemLayoutAnimation={LinearTransition}
  data={notes}
  // ...el resto queda igual
/>
```

**Qué mirar:**
- **`exiting={FadeOutRight}`** = cómo **desaparece**. Sin `exiting`, un elemento borrado se destruye al instante, sin animación.
- **`itemLayoutAnimation={LinearTransition}`:** cuando se borra una nota, las de abajo **suben suavemente** a ocupar el hueco en vez de saltar.
- Si más adelante hacés el **Paso 7 (extra)**, el botón de tachar pasa a ser un `PressableScale`.
- Las notas vienen de Firestore **en tiempo real**: si un compañero agrega o borra una, **tu lista se anima sola**.

✅ **Comprobá todo:**
1. En **Notas**: agregá una (aparece subiendo) y borrala (sale deslizándose y las otras suben).
2. El menú lateral muestra **Inicio** y **Mi perfil**. "Nuevo usuario" se abre encima, con flecha para volver.
3. Pasá a **modo oscuro**: el menú, las pestañas y todas las pantallas cambian de color.

---

## 🪜 Paso 7 — Extra: botones que rebotan (si te sobra tiempo)

> ⭐ **Este paso es opcional**: la app ya funciona sin él. Sirve para practicar un efecto **hecho a medida**.

Creá **`components/PressableScale.tsx`**:

```tsx
import { ReactNode } from "react";
import { GestureResponderEvent, Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

// Un Pressable normal convertido en "animable"
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, "style" | "children"> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number; // a qué tamaño se achica al tocarlo (1 = tamaño normal)
  children: ReactNode;
}

/**
 * Botón con microinteracción: se achica un poquito al tocarlo y "rebota" al soltarlo.
 * Se usa EXACTAMENTE como un TouchableOpacity/Pressable: <PressableScale onPress={...}>.
 */
export function PressableScale({ style, scaleTo = 0.95, children, onPressIn, onPressOut, ...rest }: PressableScaleProps) {
  // Valor compartido: vive en el hilo de la UI (no en React) y por eso la animación no se traba.
  const scale = useSharedValue(1);

  // Convierte ese valor en estilos que se actualizan solos, sin re-renderizar el componente.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: GestureResponderEvent) => {
    scale.value = withSpring(scaleTo); // withSpring = movimiento con "rebote" físico
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    scale.value = withSpring(1);
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable {...rest} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}
```

Usalo **en lugar de `TouchableOpacity`**. Hay que tocar tres archivos: `app/(drawer)/(tabs)/index.tsx` (los botones 🌙 y "+ Nuevo Usuario"), `app/(drawer)/(tabs)/notes.tsx` (el botón "Agregar") y `components/NoteItem.tsx` (la zona que se toca para tachar). En **cada uno**:

1. **Importá** el componente nuevo y **sacá** `TouchableOpacity` del import de `react-native` (ya no se usa en esos archivos):

```tsx
import { PressableScale } from "@/components/PressableScale";
```

2. **Cambiá el nombre de la etiqueta** en cada botón (abre y cierra):

```tsx
// ANTES
<TouchableOpacity style={[styles.addButton, ...]} onPress={handleGoToCreate}>
  <Text>+ Nuevo Usuario</Text>
</TouchableOpacity>

// DESPUÉS: misma sintaxis, solo cambia el nombre
<PressableScale style={[styles.addButton, ...]} onPress={handleGoToCreate}>
  <Text>+ Nuevo Usuario</Text>
</PressableScale>
```

**Qué mirar** (es el único componente "a medida" de la clase):
1. `useSharedValue(1)`: la escala actual (1 = tamaño normal). Vive en el hilo de UI.
2. `useAnimatedStyle(...)`: un estilo que **se actualiza solo** cuando cambia `scale.value`, sin volver a dibujar el componente.
3. Al apretar (`onPressIn`): `withSpring(0.95)` → se achica con rebote. Al soltar (`onPressOut`): vuelve a `1`.
4. Se usa **igual que `TouchableOpacity`**, así que es fácil que **todos** los botones se comporten igual (consistencia).

**En `NoteItem.tsx`** el cambio es el mismo, pero solo para el botón que tacha la nota (el 🗑️ puede quedarse como `TouchableOpacity`):

```tsx
// ANTES
<TouchableOpacity style={styles.content} onPress={() => onToggle(note)}> ... </TouchableOpacity>
// DESPUÉS
<PressableScale style={styles.content} scaleTo={0.97} onPress={() => onToggle(note)}> ... </PressableScale>
```

<details>
<summary>📄 <code>components/NoteItem.tsx</code> terminado (con el Paso 7)</summary>

```tsx
import { Note } from "@/constants/notes";
import { useTheme } from "@/context/ThemeContext";
import { PressableScale } from "@/components/PressableScale";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutRight } from "react-native-reanimated";

interface NoteItemProps {
  note: Note;
  onToggle: (note: Note) => void;
  onDelete: (id: string) => void;
}

// memo + funciones estables (useCallback en useNotes): la nota solo se redibuja si ella cambió.
export const NoteItem = memo(({ note, onToggle, onDelete }: NoteItemProps) => {
  const { colors } = useTheme();

  return (
    // entering = cómo APARECE una nota nueva; exiting = cómo DESAPARECE al borrarla.
    // Sin "exiting", la nota se esfumaría de golpe en el mismo instante en que se borra.
    <Animated.View
      entering={FadeInDown.springify()}
      exiting={FadeOutRight}
      style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      <PressableScale style={styles.content} scaleTo={0.97} onPress={() => onToggle(note)}>
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
      </PressableScale>
      <TouchableOpacity onPress={() => onDelete(note.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </Animated.View>
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

</details>

✅ **Comprobá:** todos esos botones se achican al tocarlos y rebotan al soltar.

---

## 🎨 Catálogo de efectos: qué hay, qué hacen y cuándo usarlos

Hasta acá usaste unos pocos efectos. Esta sección es tu **cajón de herramientas**: probá cambiando el nombre de un efecto y mirá qué pasa. Todos estos nombres **existen en tu proyecto** (están en `react-native-reanimated`).

> 💡 **Truco para aprender (el que usamos en clase):** exagerá los tiempos para *ver* el efecto, y después dejalos sutiles.

```tsx
// Para VER bien el efecto mientras aprendés: exagerá los tiempos...
entering={ZoomIn.duration(3000)}
// ...y cuando lo entiendas, dejalo sutil:
entering={ZoomIn.duration(300)}
```

### 1. Cómo se lee un efecto

```tsx
<Animated.View entering={FadeInDown.delay(200).duration(500)}>
  <Text>Hola</Text>
</Animated.View>
```

- `Animated.View` (o `Animated.Text`, `Animated.FlatList`…): la versión "animable" del componente.
- **`entering`** = cómo **aparece**. **`exiting`** = cómo **desaparece**. **`layout`** / `itemLayoutAnimation` = cómo se **mueve** cuando cambia su lugar.
- Después del nombre se **encadenan modificadores** con puntos: `.delay(200)`, `.duration(500)`, `.springify()`…

```tsx
<Animated.View
  entering={FadeInDown}   // cómo APARECE
  exiting={FadeOutRight}  // cómo DESAPARECE
>
  <Text>Una nota</Text>
</Animated.View>
```

### 2. Efectos de entrada (`entering`)

Cada familia tiene su versión de **salida** con el mismo nombre cambiando `In` por `Out` (`FadeInDown` → `FadeOutDown`, `ZoomIn` → `ZoomOut`).

| Efecto | Qué hace | Cuándo usarlo |
| :--- | :--- | :--- |
| `FadeIn` | Aparece cambiando de transparente a visible, sin moverse | Lo más discreto: textos, imágenes, cualquier cosa que no deba llamar la atención |
| `FadeInDown` / `FadeInUp` / `FadeInLeft` / `FadeInRight` | Aparece **y** se desliza un poco desde esa dirección | **Listas** (como las tarjetas de usuarios), pantallas que cargan datos |
| `SlideInDown` / `SlideInUp` / `SlideInLeft` / `SlideInRight` | Entra deslizando **desde fuera de la pantalla** | Paneles, banners de aviso, pantallas de "siguiente paso" |
| `ZoomIn` (+ `ZoomInUp`, `ZoomInDown`, `ZoomInLeft`, `ZoomInRight`, `ZoomInRotate`, `ZoomInEasyUp`, `ZoomInEasyDown`) | Crece desde cero | Avatares, íconos, ventanas de diálogo, "popups" |
| `BounceIn` (+ `BounceInUp`, `BounceInDown`, `BounceInLeft`, `BounceInRight`) | Entra y rebota al llegar | Premios, "éxito", un botón que quiere llamar la atención |
| `FlipInXUp` / `FlipInXDown` / `FlipInYLeft` / `FlipInYRight` (+ `FlipInEasyX`, `FlipInEasyY`) | Entra girando como una carta | Tarjetas, juegos, mostrar el "reverso" de algo |
| `StretchInX` / `StretchInY` | Se estira desde una línea | Barras de progreso, separadores |
| `LightSpeedInRight` / `LightSpeedInLeft` | Entra muy rápido y se acomoda | Cambios dinámicos, notificaciones |
| `RotateInDownLeft` / `RotateInDownRight` / `RotateInUpLeft` / `RotateInUpRight` | Entra girando desde una esquina | Elementos decorativos |
| `RollInLeft` / `RollInRight` | Entra rodando | Elementos lúdicos |
| `PinwheelIn` | Entra girando como un molinillo | Efecto llamativo; usar poco |

> ✋ **Menos es más:** `FadeIn*`, `SlideIn*` y `ZoomIn` cubren el 90% de los casos. Los demás son para momentos puntuales.

### 3. Modificadores: se encadenan con un punto

| Modificador | Qué hace | Ejemplo |
| :--- | :--- | :--- |
| `.delay(ms)` | Espera antes de empezar | `FadeInDown.delay(200)` |
| `.duration(ms)` | Cuánto dura (más largo = más lento) | `ZoomIn.duration(600)` |
| `.springify()` | Cambia a movimiento de **resorte** (rebota) | `FadeInDown.springify()` |
| `.damping(n)` / `.stiffness(n)` / `.mass(n)` | Afinan el resorte (hay que haber usado `springify`) | `ZoomIn.springify().damping(8)` |
| `.easing(curva)` | La "curva" del movimiento | `.easing(Easing.out(Easing.exp))` |
| `.randomDelay()` | Cada elemento arranca en un momento distinto | `FadeIn.randomDelay()` |
| `.withInitialValues({...})` | Define desde qué estilo parte | `ZoomIn.withInitialValues({ transform: [{ scale: 0.3 }] })` |
| `.withCallback(fn)` | Avisa cuando terminó (es avanzado) | — |
| `.reduceMotion(...)` | Cómo reacciona si el usuario pidió "reducir movimiento" | — |

```tsx
// Cascada: cada elemento espera un poco más que el anterior
entering={FadeInDown.delay(Math.min(index, 8) * 70)}
```

```tsx
// Con rebote (resorte). Se puede afinar:
entering={ZoomIn.springify().damping(8).stiffness(120)}
//   damping   -> cuánto "frena" el rebote (más bajo = rebota más)
//   stiffness -> qué tan "duro" es el resorte (más alto = más rápido)
```

```tsx
import { Easing, FadeIn } from "react-native-reanimated";

// Controla la "curva" del movimiento (arranca rápido y frena suave, por ejemplo)
entering={FadeIn.duration(600).easing(Easing.out(Easing.exp))}
```

```tsx
// Cada elemento arranca en un momento distinto (efecto "orgánico")
entering={FadeIn.randomDelay()}
```

```tsx
// Cambiás de dónde parte la animación
entering={ZoomIn.withInitialValues({ transform: [{ scale: 0.3 }] })}
```

### 4. Cambios de lugar (`layout` / `itemLayoutAnimation`)

Se usan cuando algo **ya está en pantalla** y cambia su posición: se borra un elemento, se agrega otro, se reordena. Sin esto, los elementos **saltan** de golpe.

| Transición | Qué hace | Cuándo usarla |
| :--- | :--- | :--- |
| `LinearTransition` | Se desliza en línea recta a su nuevo lugar | **La más usada.** Listas donde se agregan o borran elementos (como las notas) |
| `FadingTransition` | Se desvanece y reaparece en el nuevo lugar | Cuando el cambio de tamaño o posición es grande |
| `SequencedTransition` | Primero cambia un eje y después el otro | Cambios de tamaño con estilo |
| `JumpingTransition` | Salta con un pequeño brinco al nuevo lugar | Efecto lúdico |
| `CurvedTransition` | Se mueve en curva | Reordenar elementos |
| `EntryExitTransition` | Sale con un efecto y entra con otro | Cuando querés combinar `entering` y `exiting` |

```tsx
// Cuando cambia el lugar de un elemento (se borra uno, se reordena la lista)
<Animated.FlatList
  data={notes}
  itemLayoutAnimation={LinearTransition.springify()}  // con rebote
  // ...
/>

// En un elemento suelto se usa la prop "layout":
<Animated.View layout={FadingTransition}>...</Animated.View>
```

### 5. Efectos a medida (con valores compartidos)

Los *presets* son una prop; esto es para cuando necesitás algo que no existe hecho. Siempre se arma igual: **un valor** (`useSharedValue`), **un estilo que lo lee** (`useAnimatedStyle`) y **algo que lo cambia** (`withSpring`, `withTiming`…).

| Pieza | Qué hace |
| :--- | :--- |
| `withSpring(valor)` | Va al valor con rebote (natural). Ideal para toques |
| `withTiming(valor, { duration })` | Va al valor en un tiempo fijo (más "seco") |
| `withSequence(a, b, c)` | Hace varias animaciones **una después de otra** |
| `withRepeat(anim, veces, true)` | Repite (`-1` = infinito; `true` = va y vuelve) |
| `withDelay(ms, anim)` | Espera y después anima |

```tsx
// En PressableScale, en vez de resorte, un movimiento "seco" y rápido:
scale.value = withTiming(0.9, { duration: 100 });
```

**Ejemplo: sacudida (para avisar un error)**

```tsx
const x = useSharedValue(0);

// "Sacudida" (error en un campo): izquierda, derecha x4, centro
const shake = () => {
  x.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withRepeat(withTiming(10, { duration: 100 }), 4, true),
    withTiming(0, { duration: 50 })
  );
};

const shakeStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: x.value }],
}));

// <Animated.View style={shakeStyle}> ... </Animated.View>
```

**Ejemplo: latido (para llamar la atención, por ejemplo un botón "nuevo")**

```tsx
const scale = useSharedValue(1);

// Late para siempre (-1 = infinito, true = va y vuelve)
useEffect(() => {
  scale.value = withRepeat(withTiming(1.15, { duration: 600 }), -1, true);
}, []);

const pulseStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

**Ejemplo: ícono que gira (el 🌙/☀️ del tema)**

```tsx
const rotation = useSharedValue(0);

// Cada toque suma media vuelta (el ícono 🌙/☀️ gira)
const spin = () => {
  rotation.value = withTiming(rotation.value + 180, { duration: 300 });
};

const spinStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${rotation.value}deg` }],
}));
```

### 6. ¿Qué uso para qué? (casos de uso)

| Quiero… | Uso | Dónde lo viste |
| :--- | :--- | :--- |
| Que una **lista** aparezca de a poco | `entering={FadeInDown.delay(index * 70)}` | Tarjetas de usuarios |
| Que un elemento **se vaya animado** al borrarlo | `exiting={FadeOutRight}` (o `SlideOutRight`, `ZoomOut`) | Notas |
| Que los demás **se reacomoden** al borrar | `itemLayoutAnimation={LinearTransition}` | Notas |
| Que una **pantalla/bloque** se vea "armándose" | Varios `FadeInDown.delay(150, 300, 450…)` | Mi perfil |
| Un **avatar o ícono** que llame la atención | `ZoomIn.springify()` | Mi perfil |
| Un **aviso de éxito** | `BounceIn` | — |
| Un **aviso de error** que entra desde arriba | `SlideInUp` / `FadeInUp` y `exiting={FadeOutUp}` | — |
| Un **campo con error** | Sacudida (`withSequence`) | — |
| Que un **botón responda al toque** | `withSpring` a `scale: 0.95` | `PressableScale` |
| Un botón o ícono que **pida atención** | `withRepeat` (latido) | — |
| Cambiar de **pestaña** suavemente | `animation: "fade"` del `Tabs` | La barra de pestañas |
| Abrir una pantalla **como hoja** que sube | `presentation: "modal"` en el `Stack` | Opcional en "Nuevo usuario" |

### 7. Animaciones de los navegadores (no usan Reanimated)

Los navegadores traen sus **propias transiciones**: se configuran con una opción.

**Pestañas (`Tabs`)**
```tsx
<Tabs
  screenOptions={{
    animation: "shift", // "none" | "fade" | "shift"
  }}
>
```

| Valor | Qué hace |
| :--- | :--- |
| `"none"` | Cambia de pestaña al instante |
| `"fade"` | Funde una pantalla con la otra (la que usamos) |
| `"shift"` | Las pantallas se desplazan hacia el costado |

**Pantallas apiladas (`Stack`)**
```tsx
<Stack.Screen
  name="create-user"
  options={{
    title: "Nuevo usuario",
    presentation: "modal",           // se abre como una hoja que sube desde abajo
    animation: "slide_from_bottom",  // cómo se mueve al abrirse
  }}
/>
```

| `animation` | Qué hace |
| :--- | :--- |
| `"default"` | La típica de cada sistema |
| `"slide_from_right"` / `"slide_from_left"` | Entra deslizando desde ese lado |
| `"slide_from_bottom"` | Sube desde abajo |
| `"fade"` / `"fade_from_bottom"` | Aparece con un fundido |
| `"flip"` | Gira como una carta |
| `"none"` | Sin animación |

| `presentation` | Qué hace |
| :--- | :--- |
| `"card"` (por defecto) | Pantalla normal apilada |
| `"modal"` | Se abre como ventana encima de la anterior |
| `"formSheet"` / `"pageSheet"` | Hoja que cubre parte de la pantalla (iPhone) |
| `"fullScreenModal"` | Ventana a pantalla completa |
| `"transparentModal"` | Ventana con fondo transparente (ver la pantalla de atrás) |

**Menú lateral (`Drawer`)**
```tsx
<Drawer
  screenOptions={{
    drawerType: "slide",        // "front" | "back" | "slide" | "permanent"
    drawerPosition: "right",    // "left" | "right"
    overlayColor: "rgba(0,0,0,0.6)", // color con que se oscurece lo de atrás
    swipeEdgeWidth: 60,         // qué tan ancho es el borde sensible al deslizar
    // swipeEnabled: false,     // apaga el gesto (queda solo el botón ☰)
  }}
>
```

| Opción | Qué hace |
| :--- | :--- |
| `drawerType: "front"` | El menú **tapa** la pantalla (por defecto) |
| `drawerType: "slide"` | La pantalla **se corre** junto con el menú |
| `drawerType: "back"` | El menú queda **detrás** de la pantalla |
| `drawerType: "permanent"` | El menú **siempre visible** (para tablets o pantallas grandes) |
| `drawerPosition` | De qué lado sale el menú |
| `overlayColor` | El color con que se oscurece la pantalla de atrás |
| `swipeEnabled` / `swipeEdgeWidth` | Activar o apagar el gesto de deslizar y qué tan ancho es el borde sensible |

### 8. Buenas prácticas de movimiento

- **Sutil:** casi todo se resuelve con 200–500 ms. Si lo notás "demasiado", es demasiado.
- **Consistente:** una misma acción, un mismo efecto en toda la app (todas las listas entran igual).
- **Con propósito:** animá para **explicar** algo (apareció, se fue, cambió de lugar), no para decorar.
- **Poco a la vez:** si se mueve todo junto, marea.
- **Accesibilidad:** hay personas a las que el movimiento les cae mal. Podés respetar su ajuste:

```tsx
import { FadeInDown, useReducedMotion } from "react-native-reanimated";

// Respeta a quien activó "reducir movimiento" en su celular
const reduceMotion = useReducedMotion();

<Animated.View entering={reduceMotion ? undefined : FadeInDown}>...</Animated.View>
```


---

## 🔍 Revisión final

- [ ] Tengo menú lateral (☰ y deslizar) y pestañas abajo.
- [ ] "Nuevo usuario" se abre encima y al volver la lista se actualiza sola.
- [ ] Las tarjetas entran en cascada.
- [ ] ⭐ *(Extra)* Los botones rebotan al tocarlos.
- [ ] Al borrar una nota, sale animada y las demás se reacomodan.
- [ ] Sé explicar para qué sirve cada navegador (Stack, Tabs, Drawer).
- [ ] Probé **al menos tres efectos distintos** del catálogo cambiando su nombre.
- [ ] `npx tsc --noEmit` sin errores.

---

## 🆘 Si algo no anda

| Qué pasa | Por qué | Qué hacer |
| :--- | :--- | :--- |
| No aparece el botón ☰, o sale un cartel rojo *"GestureDetector must be used as a descendant of GestureHandlerRootView"* | Falta envolver la app en `GestureHandlerRootView` | Hacer el punto 3 del Paso 3 (`app/_layout.tsx`) |
| El menú no se abre al deslizar (pero sí con ☰) | Falta `GestureHandlerRootView` | Envolver todo en `app/_layout.tsx` (Paso 3) |
| Aparecen **dos barras** arriba | El `Tabs` también muestra header | `headerShown: false` en el `Tabs` |
| `Unmatched Route` o "No route named ..." | El `name` no coincide con el archivo o carpeta | `"(tabs)"` con paréntesis; `"profile"` sin `.tsx` |
| "Mi perfil" da error | Falta crear `profile.tsx` | Paso 4 |
| Falta una pestaña | El archivo no está dentro de `(tabs)` | Moverlo y reiniciar con `npx expo start -c` |
| Aparece una pestaña de más (ej. "create-user") | El archivo quedó dentro de `(tabs)` | Dejarlo en la raíz de `app/` |
| `Cannot find module '@react-navigation/drawer'` | Falta instalar | `npx expo install @react-navigation/drawer` y `npx expo start -c` |
| Error de **Worklets / Reanimated** ("mismatch") | Versiones desparejas | `npx expo install --fix` y `npx expo start -c` |
| Las tarjetas se animan otra vez al volver a la pestaña | Es normal: se vuelven a crear | No es un error |
| Warning: *"Passing an object as the argument to 'navigate' is deprecated"* | Aviso interno de las librerías | Ignoralo |
| Dejé tiempos larguísimos para probar y la app "anda lenta" | Quedaron los `duration(5000)` / `delay(1500)` de la prueba | Volver a valores chicos (200–500 ms) |
| Un efecto no hace nada | Falta usar `Animated.View` (no `View`) o el nombre está mal escrito | Revisar el import desde `react-native-reanimated` |
| Algo raro y el código está bien | Caché de Metro | `npx expo start -c` |

---

## 🌟 Para animarte (opcional)

1. **Probá el catálogo:** cambiá `FadeInDown` por `BounceIn`, `SlideInRight` o `ZoomIn` en las tarjetas y mirá la diferencia.
2. **Badge en la pestaña Notas:** `tabBarBadge` con la cantidad de notas pendientes.
3. **Ícono que gira:** que 🌙/☀️ gire al tocarlo (ver el ejemplo del catálogo).
4. **Menú a tu medida:** probá `drawerType: "slide"` o cambiá los íconos.
5. **Probalo con Legend Motion:** reescribí `PressableScale` con `Motion.Pressable` y `whileTap`, y compará cuánto código necesita cada uno.

---

## 📚 Lo que aprendiste

- **Stack, Tabs y Drawer:** para qué sirve cada uno y cuándo usarlo.
- **Navegación anidada con carpetas:** `_layout.tsx`, grupos con paréntesis y por qué anidar fue mover una carpeta.
- **Animaciones con Reanimated:** presets (`entering`, `exiting`, `itemLayoutAnimation`), modificadores (`delay`, `duration`, `springify`) y animaciones a medida (`useSharedValue`, `useAnimatedStyle`, `withSpring`, `withSequence`, `withRepeat`).
- **Opciones de los navegadores:** transición de pestañas, `presentation: "modal"` en el Stack y `drawerType` en el menú lateral.
- **Microinteracciones:** sutiles, consistentes y con propósito.
- **Reutilizar lo aprendido:** el tema (07), los hooks (05 y 06), Firebase y AsyncStorage (09) siguieron funcionando sin tocarlos.

---

**➡️ Próxima clase (11):** *Arquitectura, navegación y animación*: vamos a definir el **alcance de tu proyecto final**, sus flujos de navegación y sus animaciones clave. Andá pensando qué app te gustaría hacer. Guardá tu proyecto.
