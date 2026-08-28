# 📖 Material de Estudio — Clase 02: Primeros Pasos con React Native y Expo

**Para qué sirve este documento:** acá están todos los conceptos vistos en la Clase 02, explicados en limpio y en orden, para repasar antes del parcial, antes de la próxima clase, o cuando algo no quedó claro en vivo. No hace falta leerlo de corrido — usá el índice para ir directo a lo que necesitás repasar.

---

## 📚 Índice

1. [Programación Declarativa vs Imperativa](#declarativa)
2. [React Native vs Expo](#rn-vs-expo)
3. [Comandos Esenciales](#comandos)
4. [El Scaffolding: Qué Genera Expo Automáticamente](#scaffolding)
5. [Expo Router: Navegación por Archivos](#expo-router)
6. [Tabla Completa: HTML/Web vs React Native](#tabla-html-rn)
7. [Componentes Básicos, Uno por Uno](#componentes)
8. [Formularios: TextInput y `onChangeText`](#textinput)
9. [Imágenes: Reglas que Siempre se Cumplen](#imagenes)
10. [Flexbox: Cómo se Acomodan los Elementos](#flexbox)
11. [Unidades de Medida](#unidades)
12. [Estado con `useState`](#usestate)
13. [Props (y Props Tipadas con TypeScript)](#props)
14. [`onLayout`: Medir el Espacio Real](#onlayout)
15. [Resumen de Buenas Prácticas](#buenas-practicas)

---

## 1. Programación Declarativa vs Imperativa {#declarativa}

**Imperativo** (JavaScript "de toda la vida", o Android/iOS nativo sin React): le das instrucciones paso a paso a la computadora. *"Buscá el botón, cambiale el color a rojo, sacale el texto, ponele este otro."* Es como darle direcciones a un taxista, calle por calle.

**Declarativo** (React / React Native): describís **cómo tiene que verse la pantalla según el estado actual**, y React se encarga de calcular los cambios necesarios para llegar ahí. *"El botón tiene que ser rojo y decir 'Guardar' cuando `estaCargando` sea `false`."* Es como pedir un plato por nombre en un restaurante — no le explicás al cocinero paso a paso cómo cocinarlo.

**Por qué importa:** como programador, solo te preocupás por describir cada estado posible de la pantalla. React se encarga de mover, actualizar o borrar lo que haga falta. Esto reduce muchísimo los errores de "me olvidé de actualizar tal cosa cuando cambia tal otra".

---

## 2. React Native vs Expo {#rn-vs-expo}

| | React Native | Expo |
| :--- | :--- | :--- |
| **Qué es** | El framework base (de Meta) que traduce componentes de React a UI nativa real | Una capa de herramientas construida *sobre* React Native |
| **Configuración inicial** | Compleja — requiere Android Studio/Xcode desde el día uno | Simple — solo necesitás Node.js para arrancar |
| **Módulos nativos** (cámara, GPS, notificaciones) | Hay que configurarlos a mano | Vienen preparados, se instalan con un solo comando |
| **Para este curso** | — | ✅ Es lo que usamos |

**Importante:** React Native **no es una página web dentro de un WebView**. Los componentes se traducen a elementos nativos reales del sistema operativo — por eso `<View>` en Android termina siendo una vista nativa de Android de verdad, no un `<div>` disfrazado.

---

## 3. Comandos Esenciales {#comandos}

| Comando | Para qué sirve |
| :--- | :--- |
| `npx create-expo-app MiApp --template default@sdk-52` | Crear un proyecto nuevo, fijando una versión estable (evita problemas de compatibilidad más adelante) |
| `npm start` (o `npx expo start`) | Levantar el servidor de desarrollo |
| `npm run reset-project` | Limpiar el scaffolding de ejemplo y dejar `app/` con solo lo esencial |
| `npx expo install <paquete>` | Instalar una librería asegurando la versión compatible con tu SDK (mejor que `npm install` para paquetes de Expo) |
| `npx expo start -c` | Limpiar la caché de Metro si algo falla "porque sí" |
| `npx expo start --web` | Abrir el proyecto en el navegador (útil para probar rápido sin celular) |

**⚠️ Importante:** no instales `expo-cli` de forma global (`npm install -g expo-cli`) — es un método obsoleto. Siempre usá `npx`, que descarga y ejecuta la versión correcta sin dejar nada instalado permanentemente en tu PC.

**Ver los cambios en vivo:** escaneá el código QR que aparece en la terminal con la app **Expo Go** (Android: desde la app; iOS: desde la cámara). PC y celular tienen que estar en la misma red WiFi.

---

## 4. El Scaffolding: Qué Genera Expo Automáticamente {#scaffolding}

**Scaffolding** = el conjunto de carpetas y archivos que el generador crea solo, para darte un proyecto funcional sin que armes la configuración a mano.

```
MiApp/
├── app/                ← tus pantallas (cada archivo = una ruta)
│   ├── _layout.tsx      ← "El Marco": envuelve toda la app
│   └── index.tsx         ← "La Pintura": tu pantalla de inicio
├── assets/              ← imágenes, íconos, fuentes
├── components/           ← componentes reutilizables
├── node_modules/         ← dependencias instaladas (nunca se toca)
├── app.json              ← configuración de la app (nombre, ícono, splash)
└── package.json          ← dependencias y scripts
```

**Regla práctica:** el 90% del tiempo vas a vivir en `app/`, `components/` y `assets/`. El resto es plomería que Expo genera y que casi nunca se edita a mano.

---

## 5. Expo Router: Navegación por Archivos {#expo-router}

A diferencia de configurar la navegación manualmente, con **Expo Router** el sistema de archivos **es** la navegación: cada archivo dentro de `app/` se convierte automáticamente en una pantalla.

- `app/_layout.tsx` = el layout raíz, envuelve toda la navegación (acá vive el `<Stack />`).
- `app/index.tsx` = la pantalla de inicio.
- `expo-router/entry` = el motor invisible (vive dentro de `node_modules`, nunca se edita) que lee `app/`, encuentra `_layout.tsx` y arma todo el ruteo solo.

---

## 6. Tabla Completa: HTML/Web vs React Native {#tabla-html-rn}

React Native **no usa etiquetas HTML ni CSS**. Usa su propio set de componentes que se traducen a UI nativa real.

| HTML / Web | React Native | Uso principal |
| :--- | :--- | :--- |
| `<div>` | `<View>` | Contenedor genérico |
| `<span>`, `<p>`, `<h1>`-`<h6>` | `<Text>` | **Todo** el texto — nada de texto puede ir suelto fuera de `<Text>` |
| `<img>` | `<Image>` | Imágenes (locales o remotas) |
| `<div>` con `overflow: scroll` | `<ScrollView>` | Contenido desplazable |
| `<input type="text">` | `<TextInput>` | Campos de texto editables |
| `<button>` | `<Button>` (simple) o `<TouchableOpacity>` (con más control de estilo) | Elementos presionables |
| `<a>` | `<TouchableOpacity>` + navegación de Expo Router | Enlaces/navegación |
| N/A (no existe en web) | `<SafeAreaView>` | Evita que el contenido choque con notch/cámara/barras del sistema |

### Diferencias de comportamiento, no solo de nombre

- **Estilos:** no hay CSS. Se usan objetos de JavaScript con `StyleSheet.create()`, y las propiedades van en **camelCase**: `backgroundColor`, no `background-color`.
- **Texto suelto:** en la web podés poner texto directo dentro de un `<div>`. En React Native, si ponés texto fuera de un `<Text>`, la app tira pantalla roja de error.
- **Eventos:** `onClick` → `onPress`. `onChange` de un input → `onChangeText` (ver sección 8).
- **Bordes redondeados:** no usan `%`, van con número: `borderRadius: 50`, no `border-radius: 50%`.

---

## 7. Componentes Básicos, Uno por Uno {#componentes}

### `<View>`
El bloque de construcción más básico — una "caja" contenedora para agrupar otros elementos y darles estilo (layout, fondo, bordes). Equivalente al `<div>` de la web.

### `<Text>`
El único componente para mostrar texto. Regla de oro: **todo** texto va dentro de un `<Text>`, sin excepciones.

### `<Image>`
Para mostrar fotos o ilustraciones, locales o de internet (ver sección 9 para las reglas obligatorias).

### `<TouchableOpacity>`
Convierte cualquier cosa que esté dentro en "presionable". Al tocarlo, baja la opacidad brevemente para darle feedback visual al usuario de que el toque se registró.

```tsx
import { View, Text, TouchableOpacity } from 'react-native';

const Ejemplo = () => (
  <View style={{ flex: 1, backgroundColor: '#4c669f', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: 'white', fontSize: 20 }}>¡Hola Mundo!</Text>
    <TouchableOpacity onPress={() => alert('¡Tocado!')}>
      <Text style={{ color: 'white', marginTop: 10 }}>Tocame</Text>
    </TouchableOpacity>
  </View>
);
```

### `<ScrollView>`
Envuelve contenido que puede ser más largo que la pantalla, para que se pueda desplazar. Se usa `contentContainerStyle` (no `style`) para los estilos del contenido interno (padding, alineación).

### `<SafeAreaView>`
Contenedor especial que evita que el contenido quede tapado por el notch, la cámara frontal o las barras del sistema. Se usa como el contenedor más externo de la pantalla.

---

## 8. Formularios: TextInput y `onChangeText` {#textinput}

En la web, un `<input>` dispara `onChange` con un **evento** del que hay que extraer el valor:
```js
// Web
<input onChange={(e) => setNombre(e.target.value)} />
```

En React Native, `<TextInput>` usa **`onChangeText`**, que entrega **directamente el string** actualizado — no hace falta extraer nada:
```tsx
// React Native
<TextInput value={nombre} onChangeText={setNombre} />
```

Esto permite conectar el setter del estado directamente, sin funciones intermedias.

**Atributos más usados de `TextInput`:**

| Atributo | Para qué sirve |
| :--- | :--- |
| `value` | El valor actual (input controlado) |
| `onChangeText` | Callback con el texto nuevo |
| `placeholder` | Texto de ayuda cuando está vacío |
| `multiline` | Permite varias líneas (como un `<textarea>`) |
| `keyboardType` | Tipo de teclado (`'numeric'`, `'email-address'`, `'phone-pad'`, etc.) |
| `secureTextEntry` | Oculta el texto (contraseñas) |

---

## 9. Imágenes: Reglas que Siempre se Cumplen {#imagenes}

### Regla 1: Siempre definir `width` y `height`

React Native necesita esas dimensiones para reservar el espacio antes de que la imagen termine de cargar. Sin ellas, el tamaño puede quedar indefinido.

```tsx
// Imagen remota
<Image source={{ uri: 'https://picsum.photos/200' }} style={{ width: 150, height: 150 }} />

// Imagen local
<Image source={require('./assets/foto.png')} style={{ width: 150, height: 150 }} />
```

### Regla 2: `resizeMode` — equivalente a `background-size` en CSS

Definir `width`/`height` fija la "caja" donde entra la imagen, pero no dice qué hacer si la imagen no tiene exactamente esa proporción. Ahí entra `resizeMode`:

| `resizeMode` | Comportamiento | Cuándo usarlo |
| :--- | :--- | :--- |
| `'cover'` (default) | Llena toda la caja, **recorta** lo que sobre | Fotos de fondo, avatares cuadrados |
| `'contain'` | Se ve **completa**, puede dejar espacio vacío alrededor | Logos, íconos, fotos que no se pueden recortar |
| `'stretch'` | Estira sin mantener proporción | Casi nunca — deforma la imagen |

```tsx
<Image
  source={require('./assets/foto.png')}
  style={{ width: 150, height: 150 }}
  resizeMode="contain"
/>
```

**Si una imagen se ve "cortada"** (por ejemplo, la parte de arriba de una foto no entra en el cuadro), casi siempre es porque falta `resizeMode="contain"` — con el valor por defecto (`'cover'`), React Native prioriza llenar el espacio antes que mostrar la imagen completa.

---

## 10. Flexbox: Cómo se Acomodan los Elementos {#flexbox}

React Native usa **Flexbox** para organizar los elementos en pantalla de forma automática, sin importar el tamaño del dispositivo.

- **`flex: 1`** → el componente ocupa todo el espacio disponible que pueda.
- **`flexDirection`** → define el eje principal: `'column'` (default, de arriba hacia abajo) o `'row'` (izquierda a derecha).
- **`justifyContent`** → alinea los elementos a lo largo del **eje principal**.
- **`alignItems`** → alinea los elementos a lo largo del **eje secundario** (perpendicular al principal).

```tsx
<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
  <View style={{ flex: 1, backgroundColor: 'red' }} />
  <View style={{ flex: 1, backgroundColor: 'blue' }} />
</View>
```

**Truco para no confundirse:** si `flexDirection` es `'column'` (el default), `justifyContent` mueve las cosas verticalmente y `alignItems` horizontalmente. Si cambiás a `'row'`, se invierte.

---

## 11. Unidades de Medida {#unidades}

En React Native, un número sin unidad se interpreta como **puntos lógicos (dp)** — se ven del mismo tamaño relativo en cualquier dispositivo, sin importar la densidad de píxeles de la pantalla.

- ✅ `fontSize: 18`, `padding: 16`, `margin: 10` → números, sin unidades.
- ✅ `width: '100%'` → porcentaje, válido solo para `width`/`height`.
- ❌ `'16px'`, `'1em'`, `'2rem'`, `'auto'` → **no existen** en React Native, son unidades de CSS web.

---

## 12. Estado con `useState` {#usestate}

`useState` permite que un componente "recuerde" un valor entre renders, y que la pantalla se actualice sola cuando ese valor cambia.

```tsx
import { useState } from 'react';

const [nombre, setNombre] = useState('Juan Pérez');
// nombre       → el valor actual
// setNombre    → función para actualizarlo
// 'Juan Pérez' → valor inicial (solo se usa la primera vez)
```

Conectado a un `TextInput`, esto es lo que arma un "input controlado":
```tsx
<TextInput value={nombre} onChangeText={setNombre} />
```
Cada letra que se tipea llama a `setNombre`, React re-renderiza el componente, y el `TextInput` muestra el nuevo valor — todo en un ciclo casi instantáneo.

---

## 13. Props (y Props Tipadas con TypeScript) {#props}

Las **props** son la forma en la que un componente padre le pasa datos a un componente hijo — como argumentos de una función.

```tsx
// Definir qué props recibe el componente (TypeScript)
interface SaludoProps {
  nombre: string;
}

function Saludo({ nombre }: SaludoProps) {
  return <Text>Hola, {nombre}!</Text>;
}

// Usarlo, pasándole la prop
<Saludo nombre="Ana" />
```

**Por qué tipar las props:** si alguien usa `<Saludo />` sin pasarle `nombre`, o le pasa un número en vez de un string, el editor lo marca como error **antes** de correr la app — no hay que esperar a que explote en el celular para darse cuenta.

---

## 14. `onLayout`: Medir el Espacio Real {#onlayout}

`onLayout` es un evento que se dispara cuando un componente termina de calcular su posición y tamaño en pantalla — útil para saber las dimensiones **reales** que terminó ocupando un elemento (que pueden no ser las que uno esperaba, sobre todo con `flex`).

```tsx
<View
  onLayout={(event) => {
    const { width, height } = event.nativeEvent.layout;
    console.log('Medidas reales:', width, 'x', height);
  }}
>
  ...
</View>
```

No es algo que se use todo el tiempo, pero es muy útil para debuggear layouts que "no dan las cuentas".

---

## 15. Resumen de Buenas Prácticas {#buenas-practicas}

- ✅ **CamelCase siempre** en estilos: `backgroundColor`, no `background-color`.
- ✅ **Todo texto dentro de `<Text>`** — es la causa #1 de pantallas rojas para quien recién arranca.
- ✅ **Imágenes: siempre `width` + `height`**, y agregar `resizeMode` si la proporción no es exacta.
- ✅ **`SafeAreaView`** como contenedor raíz en pantallas completas.
- ✅ **`StyleSheet.create()`** al final del archivo, en vez de estilos inline sueltos por todos lados.
- ✅ **Bordes redondeados con números**, no con `%`.
- ✅ **`onChangeText`, no `onChange`**, para conectar `TextInput` con `useState`.
- ❌ **No instalar `expo-cli` globalmente** — siempre `npx`.

---

**Última actualización:** Material de estudio generado a partir de la Clase 02 dictada, en base a `route/Nuevo/clase-2/` y `repo-estudiantes-rn/material_estudiantes-RN/Clase 02...md`.
