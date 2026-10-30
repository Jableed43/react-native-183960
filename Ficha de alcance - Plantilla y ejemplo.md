# 📝 Ficha de alcance — Plantilla y ejemplo

**Para qué sirve:** antes de programar, hay que decidir **qué se va a construir y qué NO**. Esta ficha cabe en una hoja y es lo primero que se entrega para el proyecto final. Se completa **antes** de escribir código y se ajusta durante las Clases 12 y 13.

> **Regla de oro:** un alcance chico y terminado vale más que uno enorme a medias. Si dudás si algo entra, **no entra** (queda en "para después").

---

## ✍️ La plantilla (copiala y completala)

| # | Pregunta | Tu respuesta |
| :-: | :--- | :--- |
| 1 | **Nombre de la app** y **una frase** que la explique | |
| 2 | **¿Para quién es?** (público objetivo) | |
| 3 | **¿Qué problema resuelve?** | |
| 4 | **Funciones clave** (máximo 5 — lo que SÍ o SÍ tiene que andar) | 1. … 2. … 3. … |
| 5 | **Lo que NO hace** (por ahora) | |
| 6 | **Pantallas** (lista) | |
| 7 | **Mapa de navegación** (dibujo o esquema, ver abajo) | |
| 8 | **Datos:** ¿de dónde vienen y dónde se guardan? | |
| 9 | **¿Hay usuarios / inicio de sesión?** ¿Para qué? | |
| 10 | **¿Funciona sin internet?** ¿Qué se guarda en el celular? | |
| 11 | **3 animaciones clave** (¿en qué momentos y por qué?) | |
| 12 | **Riesgos** (¿qué podría salir mal?) y **plan B** | |
| 13 | **Hitos:** qué estará listo en la Clase 12 / 13 / 14 | |

### Cómo dibujar el mapa de navegación (pregunta 7)
Usá el mismo esquema que en la Clase 10:

```
Stack
 ├── (sección principal con menú lateral)
 │     ├── Pestaña 1 …
 │     └── Pestaña 2 …
 └── Pantallas que se abren encima (formularios, detalle…)
```

### ¿Dónde guardo cada dato? (pregunta 8) — guía rápida

| Tipo de dato | Dónde | Ejemplo |
| :--- | :--- | :--- |
| Preferencias de **ese** celular | `AsyncStorage` | Modo oscuro, la sesión, "ya vi el tutorial" |
| Datos que **ven varias personas** en tiempo real | `Firestore` (Firebase) | Notas compartidas, chat |
| Datos de **un servidor propio** o una API pública | `fetch` a una API | La lista de usuarios (`json-server`) |
| Datos solo mientras la pantalla está abierta | `useState` | El texto que estás escribiendo |

### ¿Dónde van las animaciones? (pregunta 11) — guía rápida

| Momento | Idea |
| :--- | :--- |
| Entra una lista | Cascada (`FadeInDown` con `delay`) |
| Algo sale bien | Un rebote (`BounceIn`) |
| Algo sale mal | Una sacudida |
| Se borra algo | Sale animado (`exiting`) y los demás se reacomodan |
| Se cambia de sección | Fade entre pestañas / pantallas |

---

## ✅ Ejemplo resuelto: la app que armamos en este curso ("Usuarios y Notas")

| # | Pregunta | Respuesta |
| :-: | :--- | :--- |
| 1 | Nombre y frase | **Usuarios y Notas** — una app para ver un directorio de usuarios y compartir notas con otras personas en tiempo real |
| 2 | Para quién | Estudiantes del curso que practican con una app "real" |
| 3 | Problema | Mostrar cómo una app consume una API, usa la nube y guarda preferencias en el celular |
| 4 | Funciones clave | 1. Ver y buscar usuarios · 2. Crear un usuario · 3. Notas compartidas en tiempo real (crear, tachar, borrar) · 4. Modo oscuro que se recuerda · 5. Iniciar y cerrar sesión |
| 5 | Lo que NO hace | Registro con contraseña · editar o borrar usuarios · notificaciones · perfiles con foto |
| 6 | Pantallas | Login · Usuarios · Nuevo usuario · Notas · Mi perfil |
| 7 | Mapa | Ver abajo |
| 8 | Datos | **Usuarios:** servidor propio (`json-server`) · **Notas:** Firestore · **Tema y sesión:** `AsyncStorage` |
| 9 | Usuarios / login | Sí, simulado: se escribe un nombre y queda guardado en el celular. Sirve para saber **quién escribe cada nota** |
| 10 | Sin internet | La sesión y el tema funcionan; la lista de usuarios y las notas necesitan conexión |
| 11 | Animaciones clave | 1. Las tarjetas de usuarios entran en cascada · 2. La tarjeta de login "crece" y se sacude si hay error · 3. Las notas salen deslizándose al borrarse |
| 12 | Riesgos y plan B | Si falla Firebase → mostrar solo usuarios y explicar la parte de nube con capturas · Si falla el celular → probar en el navegador |
| 13 | Hitos | Clase 12: datos reales y refinamiento · Clase 13: pruebas y publicación · Clase 14: presentación |

```
Con sesión iniciada:                        Sin sesión:

Stack                                       Stack
 ├── Drawer ─┬── Inicio ── Tabs ─┬── Usuarios   └── Login
 │           │                   └── Notas
 │           └── Mi perfil (con "Cerrar sesión")
 └── Nuevo usuario
```

---

## 🧭 Chequeo final de un buen alcance

- [ ] Cabe en **5 funciones clave** como máximo.
- [ ] Cada pantalla tiene **un propósito claro** (si una pantalla "hace de todo", hay que dividirla).
- [ ] Sé **de dónde viene cada dato** y **dónde se guarda**.
- [ ] Tengo escrito **lo que NO hace**.
- [ ] Es algo que puedo **terminar y probar** antes de la Clase 14.
- [ ] Tengo un **plan B** si falla una parte (internet, API, Firebase).
