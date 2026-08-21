Para leer este archivo correctamente presioná SHIFT + CTRL + V

# 📱 Guía para Alumnos: Instalación y Primer Proyecto en React Native

**Objetivo de esta guía:** que tengas todo instalado y entiendas qué es cada cosa **antes** de tocar código. Leela una vez de punta a punta, seguí los pasos en orden, y guardala para volver cuando te surja una duda.

---

## 📚 Índice

1. [¿Por qué React Native?](#por-que-react-native)
2. [Hay que ser realistas: lo que no es tan color de rosa](#contras)
3. [Instalación: lo que necesitás tener en tu PC](#instalacion)
4. [Cómo crear tu primer proyecto](#crear-proyecto)
5. [Qué es cada carpeta de tu proyecto](#carpetas)
6. [Resumen y próximos pasos](#resumen)

---

## 1. ¿Por Qué React Native? {#por-que-react-native}

### 💡 Lo que lo hace especial

| Ventaja | Qué significa para vos |
| :--- | :--- |
| **Un solo código, dos plataformas** | Escribís una vez y tu app corre en iOS **y** Android. No hace falta aprender Swift/Kotlin por separado. |
| **Usás lo que ya sabés** | Todo lo que aprendiste de React (componentes, props, hooks) se reutiliza casi 1 a 1. No arrancás de cero. |
| **Ves resultados en tu propio celular, al instante** | Con Expo Go, guardás el archivo y la app se actualiza sola en tu teléfono (Fast Refresh). Es tu propia app, en tu propio celular, desde el primer día. |
| **Salida laboral real** | Es uno de los frameworks mobile más pedidos del mercado, y con la misma base cubrís web + mobile. |
| **No necesitás una Mac para arrancar** | Podés desarrollar y probar en Android sin hardware Apple (para publicar en la App Store sí hace falta Mac, pero eso es mucho más adelante). |
| **Ecosistema enorme y gratuito** | Cámara, GPS, notificaciones, sensores — con Expo, la mayoría es instalar un paquete, sin escribir código nativo. |

### 🏢 Empresas que ya la usan

**Instagram, Facebook, Discord, Shopify, Walmart, Pinterest, Bloomberg, Coinbase, Tesla (app del auto), Skype.** No es una tecnología "para practicar", es la misma que corre en el celular de millones de personas ahora mismo.

### 📱 Qué se puede construir

- **Redes sociales / mensajería** (chats, feeds, stories)
- **E-commerce** (catálogo, carrito, checkout)
- **Delivery y geolocalización** (pedidos con mapa, tracking en vivo)
- **Fitness y salud** (contadores, rutinas, hábitos)
- **Productividad** (listas de tareas, notas, calendarios — el TODO List que van a armar en Clase 03 es la semilla de esto)
- **Finanzas personales** (control de gastos, billeteras)
- **Streaming / multimedia** (audio, video, galerías)
- **Apps educativas** (quizzes, flashcards)
- **Herramientas internas de empresa** (inventario, checklists de campo — un nicho laboral fuerte y menos competido)
- **Prototipos / MVPs para startups** (por la velocidad de desarrollo)

---

## 2. Hay Que Ser Realistas {#contras}

Para que arranques con expectativas correctas, no todo es perfecto:

- **No es 100% nativo:** en animaciones muy pesadas, juegos o procesamiento intensivo, el rendimiento puede quedar por debajo de una app nativa pura.
- **A veces hace falta código nativo igual:** para funcionalidades muy específicas, alguien tiene que tocar Java/Kotlin o Swift.
- **Dependés de librerías de terceros:** navegación, gestos, animaciones — casi todo pasa por paquetes de la comunidad, y a veces no están 100% actualizados a la última versión de React Native.
- **El ecosistema cambia rápido:** actualizar de una versión a otra puede romper cosas si no se hace con cuidado (por eso en este curso vamos a fijar versiones estables, no "la última porque sí").
- **Para publicar en iOS, en algún momento vas a necesitar una Mac.**

**La conclusión no es "React Native es malo"**, es que ninguna herramienta sirve para todo. Para el 90% de las apps de negocio (las que vas a construir en este curso) es una excelente elección.

---

## 3. Instalación: Lo Que Necesitás Tener en tu PC {#instalacion}

| # | Herramienta | Para qué sirve | Obligatorio |
| :--- | :--- | :--- | :--- |
| 1 | **Node.js (LTS)** | Ejecutar JavaScript fuera del navegador, correr NPM/NPX | ✅ Sí |
| 2 | **Android Studio** | SDK de Android + emulador para probar la app sin celular físico | ✅ Sí (o alternativa con celular físico) |
| 3 | **Git** | Guardar versiones de tu código, subirlo a GitHub | ✅ Sí |
| 4 | **Visual Studio Code** | El editor donde vas a escribir todo el código | ✅ Sí |
| 5 | **Expo Go** (app en tu celular) | Probar la app en tu celular físico sin compilar nada nativo | ⚠️ Alternativa al emulador |

### 🟢 Node.js

**Descargar:** https://nodejs.org/ (elegí la versión **LTS**, no la "Current")

**Pasos:** ejecutá el instalador con las opciones por defecto → abrí una terminal nueva → verificá con:
```bash
node -v
npm -v
```
Si ambos muestran un número de versión, está listo.

---

### 📱 Android Studio (el más importante)

**Descargar:** https://developer.android.com/studio

**Pasos de instalación:**

1. Descargá el instalador desde el link oficial.
2. Ejecutalo y dejá tildadas las opciones por defecto (Android SDK, Android SDK Platform, Android Virtual Device).
3. La primera vez que lo abras, elegí instalación **"Standard"** en el asistente — descarga automáticamente todo lo necesario.
4. Si te pide **habilitar la virtualización**, hacelo desde la BIOS/UEFI de tu PC (necesario para que el emulador ande rápido).
5. Creá un dispositivo virtual (**AVD**):
   - `Tools → Device Manager` (o `More Actions → Virtual Device Manager`).
   - **Create Device** → elegí un modelo (ej. Pixel 6) → **Next**.
   - Elegí una imagen de sistema reciente (con Play Store) → **Next → Finish**.
6. Probá que arranca: seleccioná el AVD y tocá el botón **▶ Play**.
7. Configurá la variable de entorno `ANDROID_HOME`:
   - Windows: `Editar las variables de entorno del sistema` → Variables de usuario → Nueva → `ANDROID_HOME` = `C:\Users\<tu-usuario>\AppData\Local\Android\Sdk`.
   - Agregá al `Path`: `%ANDROID_HOME%\platform-tools`.
8. Abrí una terminal **nueva** y verificá con `adb --version`.

**⚠️ Ojo con los recursos:** Android Studio + el emulador piden bastante RAM (mínimo 8GB, idealmente 16GB). Si tu PC es limitada, no pasa nada: usá **Expo Go** en tu celular físico y saltate el emulador por ahora.

---

### 🔧 Git

**Descargar:** https://git-scm.com/downloads

**Pasos:** instalación con opciones por defecto → verificá con `git --version`.

---

### 💻 Visual Studio Code

**Descargar:** https://code.visualstudio.com/download

**Pasos:** instalar → abrir Extensiones (`Ctrl+Shift+X`) e instalar:
- `ES7+ React/Redux/React-Native snippets`
- `Prettier - Code formatter`
- `ESLint`

---

### 📲 Expo Go (para probar en tu celular real)

- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS: https://apps.apple.com/app/expo-go/id982107779

**Importante:** tu celular y tu PC tienen que estar en la **misma red WiFi** para que funcione el escaneo de QR.

---

## 4. Cómo Crear tu Primer Proyecto {#crear-proyecto}

Con Node.js instalado, no hace falta instalar nada más de forma separada — `npx` (que viene con Node) se encarga de descargar el generador del proyecto por vos.

```bash
npx create-expo-app NombreApp --template blank-typescript@sdk-52
```

**¿Por qué ese `@sdk-52` al final y no usar la última versión directo?** Porque las versiones más nuevas de React Native a veces todavía no son 100% compatibles con librerías populares (por ejemplo las de navegación con menú lateral / Drawer). Arrancar con una versión estable evita dolores de cabeza más adelante en el curso.

Después de crear el proyecto:

```bash
cd NombreApp
npm start
```

Esto levanta el servidor de desarrollo (**Metro Bundler**) y te muestra un código QR. Lo escaneás con la app **Expo Go** desde tu celular (misma WiFi que tu PC), o presionás `a` en la terminal para abrirlo directamente en el emulador de Android Studio.

---

## 5. Qué Es Cada Carpeta de tu Proyecto {#carpetas}

Al crear el proyecto vas a ver esta estructura:

```
NombreApp/
├── app/              ← tus pantallas (acá vas a vivir la mayor parte del tiempo)
├── assets/           ← imágenes y fuentes
├── components/       ← piezas reutilizables de UI
├── constants/        ← colores y valores fijos
├── hooks/            ← lógica reutilizable
├── node_modules/     ← no tocar, son las librerías instaladas
├── app.json          ← configuración de tu app (nombre, ícono, splash)
└── package.json      ← lista de dependencias y comandos
```

| Carpeta | Qué guarda | ¿La vas a usar? |
| :--- | :--- | :--- |
| **`app/`** | Cada archivo acá adentro es una pantalla de tu app. `app/index.tsx` es la pantalla de inicio. | ✅ Constantemente |
| **`assets/`** | Tus imágenes, íconos y fuentes personalizadas. | ✅ Sí |
| **`components/`** | Componentes que armás una vez y reutilizás en varias pantallas (ej. un botón propio). | ✅ Todo el tiempo |
| **`constants/`** | Paleta de colores y valores que no cambian. | ✅ Sí |
| **`hooks/`** | Lógica reutilizable con `use...` que vas a ir armando más adelante en el curso. | ✅ Más adelante |
| **`node_modules/`** | Todas las librerías que instalaste. Es gigante y automática — **nunca la edites a mano**. | ❌ Nunca |
| **`app.json`** | Configuración general: nombre de la app, ícono, splash screen. | ✅ Sí |
| **`package.json`** | Qué librerías tenés instaladas y qué comandos podés correr (`npm start`, etc.). | ✅ Cuando instalás algo nuevo |

**Regla simple para recordar:** vas a pasar el 90% del tiempo en `app/` (pantallas), `components/` (piezas reutilizables) y `assets/` (imágenes). El resto lo genera Expo solo y casi nunca se toca a mano.

---

## 6. Resumen y Próximos Pasos {#resumen}

### ✅ Checklist antes de la próxima clase

- [ ] Node.js instalado (`node -v` funciona)
- [ ] Android Studio instalado, con un emulador creado y probado (o Expo Go instalado en tu celular)
- [ ] Git instalado (`git --version` funciona)
- [ ] VS Code instalado con las extensiones recomendadas
- [ ] Pudiste crear un proyecto de prueba con `npx create-expo-app` y verlo correr (en el emulador o en tu celular)

### 🚀 Lo que viene

En la próxima clase vamos a crear el proyecto real del curso, entender la navegación por carpetas de Expo Router, y armar tu primera pantalla con componentes propios.
