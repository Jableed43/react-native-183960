# 📋 Consigna: Proyecto Práctico "Mi Perfil"

**Clase 02 — Primeros Pasos con React Native y Expo**

## 🎯 Objetivo

Construir una pantalla de perfil ("Tarjeta de Presentación") en React Native, con foto, nombre y biografía editables en vivo, y un componente propio separado que reciba datos por props.

No es necesario que se vea "bonita" ni original — el objetivo es demostrar que sabés usar los componentes y conceptos básicos vistos hoy. El diseño lo pueden personalizar después, con tiempo.

---

## ✅ Requisitos Obligatorios

Tu pantalla `app/index.tsx` tiene que cumplir con todo esto:

1. **Contenedor seguro:** toda la pantalla envuelta en `SafeAreaView`, para que nada quede tapado por el notch o la cámara.
2. **Contenido desplazable:** el contenido dentro de un `ScrollView`, por si no entra completo en una pantalla chica.
3. **Foto de perfil:** una `Image` cargada desde una URL de internet, con `width`, `height` y `borderRadius` para que se vea circular.
4. **Nombre y biografía visibles:** mostrados como texto (dentro de `Text`, obviamente).
5. **Formulario editable:** dos `TextInput` — uno para el nombre, otro para la biografía — cada uno conectado a su propio estado con `useState`. Al escribir, el texto de arriba (nombre/bio) tiene que actualizarse **en vivo**, sin recargar nada.
6. **Botón de acción:** un `TouchableOpacity` que diga algo como "Actualizar Perfil" y que, al tocarlo, muestre alguna confirmación (puede ser un `alert()`, no hace falta más que eso).
7. **Un componente propio y separado**, en su propio archivo (`app/ClaseXX.tsx`, reemplazando `XX` por el número de esta clase), que:
   - Reciba el `nombre` como prop, **tipada con TypeScript** (`interface`).
   - Muestre una imagen **local** (de tu carpeta `assets/`) con sus dimensiones definidas correctamente.
   - Implemente `onLayout` para loguear por consola el ancho y alto reales del componente.
   - Se importe y se use dentro de `app/index.tsx`, pasándole el nombre como prop.

---

## 🚫 Reglas que se Evalúan (No Solo que "Funcione")

- **Todos los estilos en `StyleSheet.create()`** al final del archivo — nada de estilos sueltos en cada línea del JSX (salvo casos puntuales que lo justifiquen).
- **CamelCase en las propiedades de estilo:** `backgroundColor`, no `background-color`.
- **Toda imagen con `width`, `height` y `resizeMode`** definidos — si se ve cortada o deformada, van a perder puntos ahí.
- **Todo texto dentro de `<Text>`**, sin excepciones.
- **El componente secundario nombrado según el número de clase** (`Clase02.tsx` para esta clase), no con un nombre genérico tipo `Componente.tsx`.

---

## 🌟 Desafíos Opcionales (Para Quien Termine Antes o Quiera Practicar en Casa)

No suman "más nota", pero si te sobra tiempo o querés practicar en casa, son un buen ejercicio:

1. **❤️ Botón de "Me gusta" con contador:** un botón que alterna entre un corazón vacío y uno lleno, y lleva la cuenta. Mismo patrón que ya usaste con `useState` en el formulario.
2. **🏷️ Selector de estado:** una fila de opciones tipo "Disponible / Ocupado / No molestar" donde se puede elegir una, y la seleccionada se resalta con otro color.
3. **Libre:** agregá un tercer campo editable (por ejemplo "profesión" o "ciudad") siguiendo el mismo patrón que nombre/bio.

*(Pista: si querés ver cómo quedarían resueltos estos tres puntos, pedile a tu profe el material de referencia — pero primero intentalo solo/a.)*

---

## 📦 Qué Entregar

- El proyecto completo (carpeta o link al repositorio).
- Una captura de pantalla (o video corto) mostrando la app corriendo en tu celular o en el emulador, con los campos ya editados con tu información real.
- Si resolviste alguno de los desafíos opcionales, mencionalo — no hace falta que se note en el código, con que lo digas alcanza.

---

## 🕐 Tiempo Estimado

Entre 45 y 55 minutos para los requisitos obligatorios (es el tiempo que se usó en clase para armarlo en vivo). Los desafíos opcionales quedan para cuando sobre tiempo o como tarea.

---

## 🧭 Si te Trabás

- Repasá el **Material de Estudio de Clase 02** — ahí están explicados todos los conceptos que necesitás (componentes, `useState`, `TextInput`, reglas de imágenes, props tipadas, `onLayout`).
- Los errores más comunes en este proyecto son: texto suelto fuera de `<Text>` (pantalla roja), imágenes sin `width`/`height`, y olvidarse de conectar el `TextInput` con `onChangeText`.
- Si la app no arranca por un error raro de dependencias, probá `npx expo start -c` (limpia caché) antes de pedir ayuda.

---

**Última actualización:** Consigna generada a partir de la Clase 02 dictada.
