# 🧪 Plantilla de QA y reporte de bugs

**Para qué sirve:** probar tu app de forma **ordenada** (no "a ver si anda"), anotar lo que falla y decidir **qué arreglar primero**. Sirve para la Clase 12 y también para tu **proyecto final** (la usás igual en la Clase 13, antes de publicar).

> **QA** = *Quality Assurance* (aseguramiento de calidad): las prácticas para comprobar que la app funciona y cumple lo que promete. Aunque no haya un equipo de QA, **cada persona que programa prueba lo suyo**.

---

## 1. Cómo se usa (en 4 pasos)

1. **Probá** la app siguiendo el checklist de abajo.
2. **Anotá** cada problema en la tabla de bugs (aunque parezca chico).
3. **Priorizá**: primero lo que **rompe** la experiencia.
4. **Arreglá, volvé a probar** y marcá el bug como resuelto. (Repetir = *iterar*.)

---

## 2. Tipos de pruebas

| Tipo | Qué es | Ejemplo |
| :--- | :--- | :--- |
| **Smoke test** | ¿Abre y carga las pantallas base? | La app inicia, aparece el login, entro, veo la lista |
| **Prueba funcional** | Usar la app como una persona real | Crear, editar y borrar un usuario |
| **Validación de datos** | ¿Lo que se ve coincide con la API? | El usuario nuevo aparece con el nombre correcto |
| **Prueba de errores** | ¿Qué pasa cuando algo sale mal? | Apagar el servidor, escribir un email inválido |

---

## 3. Checklist de QA (copialo y tildalo)

### 🔥 Smoke
- [ ] La app abre sin pantalla roja.
- [ ] El login aparece si no hay sesión (y no aparece si ya la hay).
- [ ] Se ven las pestañas y el menú lateral.

### ✅ Funcional (camino feliz)
- [ ] La lista de datos carga.
- [ ] Puedo **crear** un registro y aparece en la lista.
- [ ] Puedo **editar** un registro y el cambio se ve.
- [ ] Puedo **borrar** un registro (y me pide confirmación).
- [ ] El buscador filtra bien (y vuelve a mostrar todo al borrar el texto).
- [ ] Cerrar sesión funciona.

### 🧯 Errores (lo que más se olvida)
- [ ] **Sin internet o con el servidor apagado:** ¿aparece un mensaje claro y un botón para reintentar?
- [ ] **Datos inválidos** (campos vacíos, email sin `@`): ¿el formulario lo avisa **sin enviar nada**?
- [ ] **Falla al guardar:** ¿la persona se entera? (nada de errores en silencio)
- [ ] **Doble toque** en un botón de enviar: ¿se crea dos veces?
- [ ] **Lista vacía:** ¿hay un mensaje en vez de una pantalla en blanco?

### 🎨 Visual y navegación
- [ ] Los textos largos **no se cortan** ni rompen el diseño.
- [ ] Modo claro **y** oscuro se ven bien.
- [ ] El botón "atrás" lleva donde se espera.
- [ ] Se ve bien en un celular chico y en uno grande.

### ⚙️ Técnico
- [ ] `npx tsc --noEmit` sin errores.
- [ ] La consola no muestra errores rojos ni advertencias nuevas.
- [ ] No hay claves, IPs ni contraseñas escritas en el código (van en el `.env`).

---

## 4. Tabla de reporte de bugs (plantilla)

| ID | Qué pasó | Pasos para reproducir | Esperado vs obtenido | Prioridad | Estado |
| :-: | :--- | :--- | :--- | :-: | :-: |
| B1 | | 1. … 2. … 3. … | | 🔴 / 🟡 / 🟢 | ⬜ Abierto |

### Cómo poner la prioridad
| Prioridad | Cuándo | Ejemplos |
| :-: | :--- | :--- |
| 🔴 **Alta** | La app **se rompe** o no se puede usar lo principal | Crash, datos que no cargan, guardar no funciona |
| 🟡 **Media** | Se puede usar, pero **mal** | Mensajes confusos, validaciones que faltan |
| 🟢 **Baja** | Cosmético | Un margen, un color, un texto |

> **Regla:** arreglá primero los 🔴, después los 🟡. Los 🟢 solo si sobra tiempo.

---

## 5. Ejemplo real: los bugs que tenía nuestra app antes de esta clase

Probamos la app de la Clase 11 con el checklist y esto es lo que apareció:

| ID | Qué pasó | Pasos para reproducir | Esperado vs obtenido | Prioridad | Cómo se arregla |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **B1** | Al fallar la red aparece un texto técnico en inglés | Apagar el servidor y recargar la lista | Esperado: un mensaje claro. Obtenido: `No se pudo conectar: Network request failed` | 🟡 Media | Capa de servicio con mensajes para personas (Paso 3) |
| **B2** | Se acepta cualquier texto como email | Crear usuario con email `hola` | Esperado: error. Obtenido: se crea igual | 🟡 Media | Validar en el formulario (Paso 4) |
| **B3** | Crear usuario **falla en silencio** | Apagar el servidor, tocar "Crear Usuario" | Esperado: avisar el error. Obtenido: no pasa nada y no se sabe por qué | 🔴 Alta | Mostrar el error en un `Alert` (Paso 4) |
| **B4** | No se puede **editar ni borrar** un usuario | Buscar un botón para editar o borrar | Esperado: poder hacerlo. Obtenido: no existe (CRUD incompleto) | 🟡 Media | Completar el CRUD (Paso 4) |
| **B5** | La app deja de traer datos cuando cambia la red | Cambiar de wifi / reconectar la PC | Esperado: sigue funcionando. Obtenido: lista cargando para siempre (la IP está escrita en el código) | 🔴 Alta | La URL va en el `.env` (Paso 2) |

> Fijate que **ninguno** es "la app explota": son los detalles que separan una app de práctica de una que se puede entregar.

---

## 6. Commits chicos y con nombre claro

Cada arreglo, **un commit**. El prefijo dice qué tipo de cambio es:

| Prefijo | Para qué | Ejemplo |
| :--- | :--- | :--- |
| `feat:` | Funcionalidad nueva | `feat: agregar edición de usuarios` |
| `fix:` | Corrección de un bug | `fix: avisar cuando falla al crear un usuario` |
| `refactor:` | Reordenar código sin cambiar lo que hace | `refactor: centralizar las llamadas a la API en un servicio` |
| `style:` | Formato o estilos | `style: mejorar el espaciado de las tarjetas` |
| `docs:` | Documentación | `docs: actualizar el reporte de bugs` |

**Evitá** `git commit -m "cambios varios"`: dentro de un mes nadie sabe qué cambió.

**Marcadores en el código** para lo que queda pendiente:
```ts
// TODO: agregar paginación cuando haya más de 50 usuarios
// FIXME: el tiempo de espera de 8 segundos es corto para conexiones lentas
```
