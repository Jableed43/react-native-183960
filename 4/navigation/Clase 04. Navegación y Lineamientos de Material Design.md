# Clase 04. Navegación y Lineamientos de Material Design - Guía Docente

## 📚 Índice

1. [Introducción](#introducción)
2. [React Navigation](#react-navigation)
   - [¿Qué es React Navigation?](#qué-es-react-navigation)
   - [Conceptos de Navegación: El Stack (Pila)](#teoria-stack)
   - [Navegación Nativa vs JavaScript](#navegacion-nativa)
   - [Tipos de Navegadores](#tipos-de-navegadores)
   - [Estándares de Navegación Mobile](#estándares-de-navegación-mobile)
3. [Componentes de Navegación](#componentes-de-navegación)
   - [Stack Navigator](#stack-navigator)
   - [Tab Navigator](#tab-navigator)
   - [Drawer Navigator](#drawer-navigator)
4. [Instalación y Configuración](#instalación-y-configuración)
   - [Dependencias Necesarias](#dependencias-necesarias)
   - [Configuración Inicial](#configuración-inicial)
   - [Estructura de Carpetas](#estructura-de-carpetas)
5. [Material Design](#material-design)
   - [¿Qué es Material Design?](#qué-es-material-design)
   - [Principios de Material Design](#principios-de-material-design)
   - [React Native Paper](#react-native-paper)
   - [Estilos Compartidos](#estilos-compartidos)
   - [Context API para Tema](#context-api-para-tema)
   - [SafeAreaView y StatusBar](#safeareaview-y-statusbar)
6. [Proyecto Práctico: App con Navegación](#proyecto-práctico-app-con-navegación)
7. [Buenas Prácticas](#buenas-prácticas)
8. [Resumen y Recursos](#resumen-y-recursos)

---

## Introducción {#introducción}

En esta clase aprenderemos a implementar navegación en aplicaciones React Native y a aplicar los principios de Material Design para crear interfaces coherentes y profesionales.

### Objetivos de la Clase

- ✅ Comprender cómo funciona React Navigation
- ✅ Implementar diferentes tipos de navegadores (Stack, Tabs, Drawer)
- ✅ Aplicar los principios de Material Design 3
- ✅ Usar React Native Paper para componentes Material Design
- ✅ Construir una aplicación con navegación completa

---

## React Navigation {#react-navigation}

### ¿Qué es React Navigation? {#qué-es-react-navigation}

**React Navigation** es la biblioteca más utilizada para implementar navegación en aplicaciones React Native. Permite crear sistemas de navegación complejos y profesionales.

**Características principales:**
- Sistema de navegación declarativo
- Soporte para Stack, Tabs, Drawer y otros tipos de navegadores
- Paso de parámetros entre pantallas
- Integración con el ciclo de vida de React Native
- Gestos nativos para navegación
- Animaciones fluidas y personalizables

**¿Por qué React Navigation?**
- ✅ Es la solución estándar de la industria
- ✅ Excelente documentación y comunidad
- ✅ Optimizado para rendimiento
- ✅ Compatible con Expo
- ✅ Soporte activo y actualizaciones frecuentes

---

### Tipos de Navegadores {#tipos-de-navegadores}

React Navigation ofrece varios tipos de navegadores, cada uno diseñado para diferentes casos de uso:

| Tipo de Navegador | Uso Principal | Cuándo Usar |
|-------------------|---------------|-------------|
| **Stack** | Flujos lineales (pila) | Formularios, detalles, navegación profunda |
| **Tabs** | Navegación horizontal | Secciones principales independientes |
| **Drawer** | Menú lateral | Accesos secundarios, configuraciones |
| **Material Top Tabs** | Tabs horizontales | Categorías dentro de una sección |

---

### Estándares de Navegación Mobile {#estándares-de-navegación-mobile}

Aunque los navegadores pueden usarse libremente, existen estándares recomendados para crear experiencias de usuario cómodas y familiares:

#### 1. Stack Navigator

**Cuándo usar:**
- Flujos de tareas lineales (paso 1 → paso 2 → paso 3)
- Pantallas de detalle (lista → detalle)
- Formularios multi-paso
- Navegación profunda (anidada)

**Ejemplos:**
- Lista de productos → Detalle del producto
- Registro de usuario (paso 1 → paso 2 → paso 3)
- Chat → Conversación individual

#### 2. Tab Navigator

**Cuándo usar:**
- Navegación principal de la aplicación
- Secciones independientes entre sí
- Acceso rápido a funcionalidades principales

**Ejemplos:**
- Inicio, Perfil, Búsqueda, Configuración
- Home, Favoritos, Carrito, Perfil (e-commerce)
- Feed, Explorar, Notificaciones, Perfil (red social)

#### 3. Drawer Navigator

**Cuándo usar:**
- Menús laterales con opciones secundarias
- Configuraciones y ajustes
- Accesos a secciones de importancia media o baja
- Apps con muchas pantallas

**Ejemplos:**
- Menú de configuración
- Accesos a secciones secundarias
- Navegación en apps complejas

---

## Componentes de Navegación {#componentes-de-navegación}

### Stack Navigator {#stack-navigator}

#### ¿Qué es un Stack Navigator?

Un **Stack Navigator** funciona como una pila: cada vez que navegas hacia una nueva pantalla, esta se "apila" encima de la anterior. Al volver atrás, se "desapila" la pantalla superior.

**Características:**
- Navegación tipo pila (LIFO - Last In, First Out)
- Historial de navegación automático
- Botón "Atrás" nativo
- Gestos de deslizamiento para volver (iOS/Android)
- Transiciones animadas

#### Implementación

React Navigation implementa Stack Navigator con `@react-navigation/native-stack`, que usa `react-native-screens` para mejor rendimiento.

**Ventajas de Native Stack:**
- ✅ Mejor rendimiento que Stack en JavaScript puro
- ✅ Transiciones más fluidas
- ✅ Integración nativa con el sistema operativo
- ✅ Gestos nativos optimizados

---

### Tab Navigator {#tab-navigator}

#### ¿Qué son los Tabs?

Los **Tabs** (pestañas) permiten crear una barra de navegación, generalmente en la parte inferior o superior de la pantalla, para acceder rápidamente a secciones principales de la app.

**Características:**
- Cada tab representa una pantalla
- Navegación entre tabs sin perder el estado
- Indicadores visuales (iconos, badges)
- Acceso rápido a funcionalidades principales

#### Cuándo Usar Tabs

**Ideal para:**
- Navegación horizontal entre funcionalidades
- Secciones principales independientes
- Apps con 3-5 secciones principales
- Acceso rápido y frecuente a diferentes áreas

**Ejemplos comunes:**
- "Inicio", "Perfil", "Ajustes"
- "Home", "Búsqueda", "Favoritos", "Perfil"
- "Feed", "Explorar", "Crear", "Notificaciones", "Perfil"

---

### Drawer Navigator {#drawer-navigator}

#### ¿Qué son los Drawers?

Los **Drawers** (cajones laterales) permiten acceder a un menú deslizable desde el borde izquierdo o derecho de la pantalla.

**Características:**
- Menú lateral deslizable
- Agrupa opciones secundarias
- No satura la UI principal
- Ideal para apps con muchas pantallas

#### Cuándo Usar Drawer

**Ideal para:**
- Menús con muchas opciones
- Accesos a secciones secundarias
- Configuraciones y ajustes
- Apps complejas con múltiples funcionalidades

**Ejemplos:**
- Menú de configuración
- Navegación entre diferentes módulos
- Accesos a funcionalidades menos frecuentes

---

## Instalación y Configuración {#instalación-y-configuración}

### Dependencias Necesarias {#dependencias-necesarias}

Para implementar navegación en React Native con Expo, necesitas instalar las siguientes dependencias:

#### Paquetes Principales

**1. `@react-navigation/native`**
- **Qué es:** El núcleo de React Navigation
- **Para qué sirve:** Proporciona la API base para configurar navegadores (stack, tabs, drawer, etc.), manejar el historial de navegación y la integración con el ciclo de vida de React Native
- **Por qué es necesaria:** Sin este paquete no existe el sistema de navegación, es el corazón que conecta todo

**2. `@react-navigation/native-stack`**
- **Qué es:** Implementación de Stack Navigator optimizada usando la librería nativa `react-native-screens`
- **Para qué sirve:** Manejar navegación tipo "pila" (push/pop de pantallas) con mejor rendimiento que el stack en JavaScript puro
- **Por qué es necesaria:** Es la opción más común para transiciones rápidas y fluidas entre pantallas

**3. `@react-navigation/bottom-tabs`**
- **Qué es:** Implementación de Tab Navigator para la parte inferior de la pantalla
- **Para qué sirve:** Crear barras de pestañas en la parte inferior
- **Por qué es necesaria:** Para implementar navegación por tabs

**4. `@react-navigation/drawer`**
- **Qué es:** Implementación de Drawer Navigator
- **Para qué sirve:** Crear menús laterales deslizables
- **Por qué es necesaria:** Para implementar navegación por drawer

#### Dependencias de Soporte

**5. `react-native-screens`**
- **Qué es:** Librería nativa que gestiona pantallas como vistas nativas en lugar de vistas de JavaScript
- **Para qué sirve:** Mejora el rendimiento de la navegación optimizando el montaje/desmontaje de pantallas y reduciendo el consumo de memoria
- **Por qué es necesaria:** React Navigation la usa para que los stacks sean más rápidos y consuman menos recursos

**6. `react-native-gesture-handler`**
- **Qué es:** Sistema de manejo de gestos optimizado para React Native
- **Para qué sirve:** Detectar y procesar gestos complejos como arrastrar, deslizar, toques múltiples, etc.
- **Por qué es necesaria:** React Navigation lo usa para gestos de navegación (por ejemplo, deslizar para volver atrás o abrir un drawer)

**7. `react-native-safe-area-context`**
- **Qué es:** Manejo del "área segura" en pantallas (espacios que no deben cubrirse, como notch, barra de estado o barra de navegación)
- **Para qué sirve:** Ajustar automáticamente los elementos de UI para que no se superpongan con zonas no seguras del dispositivo
- **Por qué es necesaria:** React Navigation lo integra para que los encabezados, tabs y drawers se posicionen correctamente en todos los dispositivos

**8. `react-native-reanimated`**
- **Qué es:** Librería de animaciones nativas de alto rendimiento para React Native
- **Para qué sirve:** Crear animaciones fluidas y complejas, controladas en el hilo nativo sin depender del JS thread
- **Por qué es necesaria:** React Navigation la usa en transiciones y animaciones de gestos para evitar lag y mejorar la experiencia visual

#### Dependencias de Material Design

**9. `react-native-paper`**
- **Qué es:** Librería de componentes Material Design 3 para React Native
- **Para qué sirve:** Proporcionar componentes Material Design listos para usar (Cards, Buttons, FAB, etc.)
- **Por qué es necesaria:** Para implementar Material Design de forma rápida y consistente

**10. `@expo/vector-icons`**
- **Qué es:** Colección de iconos vectoriales para Expo
- **Para qué sirve:** Proporcionar iconos para tabs, botones y otros elementos de UI
- **Por qué es necesaria:** Para usar iconos en los tabs y otros componentes de navegación

**11. `expo-status-bar`**
- **Qué es:** Componente para controlar la barra de estado del dispositivo
- **Para qué sirve:** Configurar el estilo de la barra de estado (claro/oscuro) según el tema
- **Por qué es necesaria:** Para que la barra de estado se adapte al tema de la aplicación

---

### Configuración Inicial {#configuración-inicial}

#### Instalación de Dependencias

Puedes instalar todas las dependencias en un solo comando:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-gesture-handler react-native-safe-area-context react-native-reanimated react-native-paper @expo/vector-icons expo-status-bar
```

**Nota importante:** Usa `npx expo install` en lugar de `npm install` para asegurar compatibilidad de versiones con Expo.

#### Estructura Básica de Navegación

```typescript
// App.tsx o _layout.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### ⚠️ Nota Importante: NavigationContainer y Expo Router

**Si estás usando Expo Router, NO debes agregar `NavigationContainer` manualmente.**

Expo Router ya maneja el `NavigationContainer` internamente. Si intentas agregar uno manualmente, obtendrás un error de "nested NavigationContainer".

**Diferencia entre los dos enfoques:**

**1. React Navigation Manual (sin Expo Router):**
- Usas `App.tsx` en la raíz del proyecto
- Debes agregar `NavigationContainer` manualmente
- Tienes control total sobre la configuración de navegación
- `package.json` tiene: `"main": "node_modules/expo/AppEntry.js"`

**2. Expo Router (file-based routing):**
- Usas la carpeta `app/` con `_layout.tsx`
- Expo Router maneja `NavigationContainer` automáticamente
- Navegación basada en la estructura de archivos
- `package.json` tiene: `"main": "expo-router/entry"`

**Si usas Expo Router, tu `_layout.tsx` debe verse así:**

```typescript
// app/_layout.tsx (con Expo Router)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        {/* ❌ NO agregues NavigationContainer aquí - Expo Router ya lo maneja */}
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

**Error común:**
```
Render Error: Looks like you have nested a 'NavigationContainer' 
inside another. Normally you need only one container at the root 
of the app.
```

**Solución:** Elimina el `NavigationContainer` manual si estás usando Expo Router.

#### Estructura de Carpetas {#estructura-de-carpetas}

Para organizar correctamente una aplicación con navegación y Material Design, se recomienda la siguiente estructura de carpetas dentro de `app/`:

```
app/
  ├── context/          # Context API para estado global (tema, usuario, etc.)
  ├── navigation/       # Configuración de navegadores (Stack, Tabs, Drawer)
  ├── screens/          # Componentes de pantalla
  ├── styles/           # Estilos compartidos y reutilizables
  └── theme/            # Configuración de temas Material Design
```

**Explicación de cada carpeta:**

- **`context/`**: Contiene los contextos de React para manejar estado global, como el tema claro/oscuro
- **`navigation/`**: Contiene los archivos de configuración de los navegadores (HomeStack.tsx, TabNavigator.tsx)
- **`screens/`**: Contiene los componentes de cada pantalla de la aplicación
- **`styles/`**: Contiene estilos compartidos que se reutilizan en múltiples componentes
- **`theme/`**: Contiene la configuración de los temas Material Design (claro y oscuro)

Esta estructura facilita la organización del código y hace que la aplicación sea más mantenible y escalable.

---

## Material Design {#material-design}

### ¿Qué es Material Design? {#qué-es-material-design}

**Material Design** es una guía de diseño creada por Google para lograr interfaces visualmente coherentes, suaves y con jerarquía clara, utilizada principalmente en Android pero aplicable a cualquier plataforma.

**Características principales:**
- Sistema de diseño completo y consistente
- Principios claros de jerarquía visual
- Componentes reutilizables y reconocibles
- Animaciones suaves y feedback visual
- Guías de color, tipografía y espaciado

**Versiones:**
- **Material Design 1 (2014):** Versión inicial
- **Material Design 2 (2018):** Mejoras y refinamientos
- **Material Design 3 (2021):** Versión actual con diseño más dinámico y personalizable

**Referencia oficial:** https://m3.material.io

---

### Principios de Material Design {#principios-de-material-design}

#### 1. Jerarquía Visual Clara

- **Contraste:** Usar diferentes tamaños, pesos y colores para establecer importancia
- **Espaciado:** Agrupar elementos relacionados y separar los no relacionados
- **Elevación:** Usar sombras y elevación para crear profundidad

#### 2. Colores Principales y Secundarios

- **Color primario:** Color principal de la marca/aplicación
- **Color secundario:** Color complementario para acentos
- **Paleta de colores:** Sistema consistente de colores para toda la app

#### 3. Componentes Reconocibles

- **Cards:** Contenedores elevados para contenido relacionado
- **FAB (Floating Action Button):** Botón flotante para acción principal
- **App Bars:** Barras superiores con título y acciones
- **Buttons:** Botones con estados claros (elevated, outlined, text)
- **Inputs:** Campos de texto con labels y estados de error

#### 4. Animaciones Suaves y Feedback

- **Transiciones:** Movimientos fluidos entre estados
- **Feedback visual:** Respuesta inmediata a interacciones del usuario
- **Microinteracciones:** Animaciones sutiles que mejoran la experiencia

---

### React Native Paper {#react-native-paper}

#### ¿Qué es React Native Paper?

**React Native Paper** es una librería que implementa los componentes de Material Design 3 para React Native, proporcionando componentes listos para usar que siguen las guías de Material Design.

**Componentes principales:**
- **Botones:** Button, FAB, IconButton
- **Inputs:** TextInput, SearchBar
- **Navegación:** BottomNavigation, Tabs
- **Contenedores:** Card, Surface, Divider
- **Feedback:** Snackbar, Dialog, Banner
- **Y muchos más...**

**Ventajas:**
- ✅ Componentes Material Design 3 listos para usar
- ✅ Personalizables y temáticos
- ✅ Accesibilidad integrada
- ✅ Compatible con Expo
- ✅ Documentación completa

**Instalación:**
```bash
npx expo install react-native-paper
```

**Instalación:**
```bash
npx expo install react-native-paper
```

**Referencia:** https://callstack.github.io/react-native-paper/

#### Estilos Compartidos

Para mantener consistencia visual y evitar repetición de código, es recomendable crear un archivo de estilos compartidos (`app/styles/sharedStyles.ts`).

**Ventajas de usar estilos compartidos:**
- ✅ Consistencia visual en toda la aplicación
- ✅ Fácil mantenimiento: cambios en un solo lugar
- ✅ Reutilización de código
- ✅ Mejor organización del código

**Ejemplo de estilos compartidos:**

```typescript
import { StyleSheet } from 'react-native';

// Estilo de Card reutilizable con elevación Material Design
export const cardStyle = {
  marginBottom: 16,
  borderRadius: 4,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
};

// Estilos comunes para contenedores y títulos
export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
```

**Uso en componentes:**

```typescript
import { cardStyle, sharedStyles } from '../styles/sharedStyles';

// Usar en el componente
<Card style={cardStyle}>
  <Card.Content>
    <Text style={sharedStyles.title}>Título</Text>
  </Card.Content>
</Card>
```

#### Context API para Tema

Para manejar el tema claro/oscuro de forma global en la aplicación, se utiliza React Context API.

**¿Por qué usar Context API para el tema?**
- Permite cambiar el tema desde cualquier componente
- El estado del tema se mantiene globalmente
- Evita prop drilling (pasar props por múltiples niveles)
- Facilita la implementación de toggle de tema

**Estructura básica del ThemeContext:**

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Exportación como objeto para evitar warnings de Expo Router
const Theme = { ThemeContext, ThemeProvider, useTheme }
export default Theme;
```

**Uso del Context:**

```typescript
// En _layout.tsx
import Theme from './context/ThemeContext';

export default function App() {
  return (
    <Theme.ThemeProvider>
      {/* Resto de la app */}
    </Theme.ThemeProvider>
  );
}

// En cualquier componente
import Theme from '../context/ThemeContext';

function SettingsScreen() {
  const { isDarkMode, toggleTheme } = Theme.useTheme();
  // Usar isDarkMode y toggleTheme
}
```

**Nota importante:** Se exporta como objeto (`Theme`) en lugar de exportaciones individuales para evitar warnings de Expo Router sobre exports por defecto.

#### SafeAreaView y StatusBar

Para manejar correctamente las áreas seguras del dispositivo y la barra de estado, es importante configurar `SafeAreaView` y `StatusBar` adecuadamente.

**SafeAreaView con edges:**

Para evitar conflictos con el StatusBar, se debe usar `SafeAreaView` con la prop `edges`:

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView 
  style={styles.container}
  edges={['bottom', 'left', 'right']}  // Excluye 'top' para no interferir con StatusBar
>
  {/* Contenido */}
</SafeAreaView>
```

**¿Por qué excluir 'top'?**
- El StatusBar ocupa el área superior
- Si incluimos 'top', puede haber conflictos visuales
- Solo necesitamos proteger los bordes inferior, izquierdo y derecho

**Configuración del StatusBar:**

El `StatusBar` debe configurarse dentro del `PaperProvider` para que tenga acceso al tema:

```typescript
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import Theme from './context/ThemeContext';

function AppContent() {
  const { isDarkMode } = Theme.useTheme();
  
  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      {/* StatusBar se adapta al tema: light en modo oscuro, dark en modo claro */}
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {/* Resto de la app */}
    </PaperProvider>
  );
}
```

**Explicación del estilo del StatusBar:**
- `style="light"`: Texto e iconos claros (para fondos oscuros)
- `style="dark"`: Texto e iconos oscuros (para fondos claros)
- Se invierte la lógica: modo oscuro → StatusBar light, modo claro → StatusBar dark

---

## Proyecto Práctico: App con Navegación {#proyecto-práctico-app-con-navegación}

### Objetivo

Construir una aplicación con navegación completa que demuestre el uso de Stack Navigator, Tab Navigator y los principios de Material Design de forma práctica.

### Componentes/Conceptos a Aplicar

- **Stack Navigator**: Navegación entre pantallas en flujo lineal
- **Tab Navigator**: Navegación principal por pestañas
- **React Native Paper**: Componentes Material Design
- **Paso de parámetros**: Enviar datos entre pantallas
- **Navegación anidada**: Combinar diferentes tipos de navegadores

### Pasos Generales para Construir la Aplicación

1. **Inicializar proyecto**: Crear proyecto Expo con `npx create-expo-app AppNavegacion`
2. **Instalar dependencias**: Instalar todos los paquetes en un solo comando
3. **Crear estructura de carpetas**: Organizar `context/`, `navigation/`, `screens/`, `styles/`, `theme/`
4. **Crear estilos compartidos**: Implementar `sharedStyles.ts` con estilos reutilizables
5. **Crear tema Material Design**: Configurar temas claro y oscuro en `theme/theme.ts`
6. **Crear Context de tema**: Implementar `ThemeContext.tsx` para manejo global del tema
7. **Configurar layout principal**: Configurar `_layout.tsx` con `SafeAreaProvider`, `ThemeProvider` y `PaperProvider`
8. **Configurar StatusBar**: Agregar `StatusBar` dentro de `PaperProvider` con adaptación al tema
9. **Crear Stack Navigator**: Implementar navegación tipo pila para flujos lineales
10. **Crear Tab Navigator**: Implementar navegación por pestañas para secciones principales
11. **Crear pantallas básicas**: Home, Perfil, Detalles, Configuración con `SafeAreaView` y `edges`
12. **Implementar paso de parámetros**: Enviar datos entre pantallas (ej: de lista a detalle)
13. **Integrar React Native Paper**: Agregar componentes Material Design (Button, Card, FAB)
14. **Aplicar estilos compartidos**: Usar `cardStyle` y `sharedStyles` en todas las pantallas
15. **Implementar navegación anidada**: Combinar Stack dentro de Tabs
16. **Agregar gestos y animaciones**: Verificar que los gestos nativos funcionen
17. **Aplicar estilos Material Design**: Usar elevación, espaciado en múltiplos de 8px y jerarquía visual
18. **Verificar funcionalidad**: Probar navegación entre todas las pantallas y toggle de tema

### Conceptos Aplicados

- **Navegación declarativa**: Configurar navegadores con componentes
- **Stack Navigator**: Flujos lineales y navegación profunda
- **Tab Navigator**: Navegación horizontal entre secciones
- **Paso de parámetros**: Enviar y recibir datos entre pantallas
- **Navegación anidada**: Combinar diferentes tipos de navegadores
- **Material Design 3**: Aplicar principios de diseño visual
- **React Native Paper**: Usar componentes Material Design
- **Estilos compartidos**: Reutilización de código y consistencia visual
- **Context API**: Manejo global del estado del tema
- **SafeAreaView**: Respetar áreas seguras del dispositivo
- **StatusBar**: Adaptación de la barra de estado al tema

### Resultado Final

Una aplicación funcional que permite:
- Navegar entre diferentes secciones usando Tabs
- Navegar a pantallas de detalle usando Stack
- Ver información pasada entre pantallas
- Interactuar con componentes Material Design
- Experimentar con gestos nativos de navegación

---

## Buenas Prácticas {#buenas-prácticas}

### Navegación

- ✅ **Usa Stack para flujos lineales**: Formularios, detalles, procesos paso a paso
- ✅ **Usa Tabs para secciones principales**: Home, Perfil, Búsqueda, etc.
- ✅ **Usa Drawer para opciones secundarias**: Configuraciones, menús laterales
- ✅ **Combina navegadores cuando sea necesario**: Stack dentro de Tabs es común
- ✅ **Pasa parámetros de forma tipada**: Usa TypeScript para type safety
- ❌ **Evita anidar demasiado**: Máximo 2-3 niveles de anidación
- ❌ **No uses navegación innecesaria**: Cada pantalla debe tener un propósito claro

### Material Design

- ✅ **Sigue la jerarquía visual**: Usa tamaño, color y espaciado para importancia
- ✅ **Usa componentes reconocibles**: Cards, FAB, Buttons de Material Design
- ✅ **Aplica feedback visual**: Respuesta inmediata a interacciones
- ✅ **Mantén consistencia**: Mismo estilo en toda la aplicación
- ✅ **Usa elevación apropiada**: Sombras para crear profundidad
- ✅ **Usa espaciado en múltiplos de 8px**: 8, 16, 24, 32 para consistencia
- ✅ **Crea estilos compartidos**: Reutiliza código y mantén consistencia
- ✅ **Configura StatusBar correctamente**: Dentro de PaperProvider y adaptado al tema
- ✅ **Usa SafeAreaView con edges**: Excluye 'top' para evitar conflictos con StatusBar
- ❌ **No satures la UI**: Deja espacio en blanco para respiración visual
- ❌ **No mezcles estilos**: Mantén un sistema de diseño consistente
- ❌ **No olvides el Context**: Usa Context API para tema global, no prop drilling

---

## Resumen y Recursos {#resumen-y-recursos}

### Conceptos Clave Aprendidos

1. **React Navigation**: Sistema de navegación estándar para React Native
2. **Stack Navigator**: Para flujos lineales y navegación profunda
3. **Tab Navigator**: Para navegación horizontal entre secciones principales
4. **Drawer Navigator**: Para menús laterales y opciones secundarias
5. **Material Design 3**: Guía de diseño para interfaces coherentes
6. **React Native Paper**: Librería de componentes Material Design para React Native
7. **Estilos Compartidos**: Reutilización de código y mantenimiento de consistencia visual
8. **Context API**: Manejo global del estado (tema claro/oscuro)
9. **SafeAreaView**: Respeto de áreas seguras del dispositivo
10. **StatusBar**: Configuración adaptativa según el tema de la aplicación

### Recursos Oficiales

- **React Navigation:** https://reactnavigation.org/docs/getting-started
- **React Native Paper:** https://callstack.github.io/react-native-paper/
- **Material Design 3:** https://m3.material.io/
- **Expo Router (alternativa):** https://docs.expo.dev/guides/routing/

### Próximos Pasos

- Experimentar con diferentes combinaciones de navegadores
- Personalizar transiciones y animaciones
- Implementar navegación condicional basada en autenticación
- Profundizar en Material Design 3 y sus componentes
- Explorar React Native Paper y sus componentes avanzados

---

**Última actualización:** Marzo 2026 - Guía docente unificada.
