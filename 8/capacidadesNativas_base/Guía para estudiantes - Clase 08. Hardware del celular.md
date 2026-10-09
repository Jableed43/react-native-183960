# 📱 Clase 08 — Usá el hardware de tu celular: cámara, sensores y GPS (Guía para estudiantes)

En esta guía tu app deja de ser solo "pantallas con datos" y empieza a **hablar con el celular**: vas a sacar fotos, leer el movimiento del teléfono y saber dónde estás.

- **Partís de:** el proyecto base `capacidadesNativas_base` que te pasa el profe, **o** un proyecto Expo nuevo que creás en el Paso 1. **Es un proyecto nuevo**, aparte de la app de usuarios.
- **Terminás con:** una app con un menú de tres herramientas: **Cámara**, **Sensores** y **Ubicación**.
- **Tiempo estimado:** 90 a 120 minutos.

---

## 🗺️ Mapa de la guía

| Paso | Qué hacés | Archivo |
| :---: | :--- | :--- |
| 1 | Preparar el proyecto (base o desde cero) | `package.json`, `app/_layout.tsx` |
| 2 | Menú con tarjetas | `app/index.tsx`, `app/_layout.tsx` |
| 3 | Cámara con permisos y vista previa | `app/camera.tsx` |
| 4 | Acelerómetro y giroscopio | `app/sensors.tsx` |
| 5 | Ubicación GPS | `app/location.tsx` |

---

## 🧠 La teoría que necesitás

### ¿Qué es el acceso nativo?
Tu celular tiene cámara, GPS y sensores de movimiento. Con **Expo** los usás desde JavaScript, sin escribir Swift ni Kotlin: cada capacidad es un **módulo** (`expo-camera`, `expo-location`, `expo-sensors`).

### La regla de oro: los permisos
No podés usar la cámara de alguien sin que te deje. El flujo siempre es el mismo:

1. **Preguntar:** "¿Me dejás usar la cámara?"
2. **Esperar** la respuesta del usuario.
3. **Actuar** solo si dijo que sí.

| Estado del permiso | Qué significa |
| :--- | :--- |
| `granted: true` | Dijo que sí → podés usar el hardware |
| `granted: false` y `canAskAgain: true` | Dijo que no, pero podés volver a preguntar |
| `granted: false` y `canAskAgain: false` | Dijo "no" para siempre → solo se cambia desde **Ajustes del celular** |

> 💡 **Buenas prácticas:** pedí el permiso cuando lo necesitás (no al abrir la app), explicá **para qué** lo pedís, y pensá qué pasa si el usuario dice que no.

### Los sensores y la batería
Un sensor **sigue enviando datos aunque cambies de pantalla** si no lo apagás, y eso gasta batería. Por eso siempre se **limpia** cuando salís de la pantalla (con el `return` de un `useEffect`).

---

## ✅ Antes de empezar

1. **Necesitás un celular real** con **Expo Go**, en la **misma wifi** que tu PC. El emulador no tiene sensores ni cámara de verdad.
2. En la carpeta del proyecto: `npx expo start` y escaneá el QR.
3. Esta clase **no usa** el servidor `json-server`: no lo prendas.
4. Prendé el **GPS** del celular.

> ⚠️ En el **navegador** (`--web`) la cámara y la ubicación funcionan, pero los **sensores no**. Probá todo en Expo Go.

---

## 🪜 Paso 1 — Preparar el proyecto

Esta clase usa un **proyecto nuevo** (no la app de usuarios). Elegí una opción:

### Opción A — El profe te pasó la carpeta `capacidadesNativas_base`
1. Abrila en VS Code y, dentro de la carpeta, corré `npm install` (solo si no trae `node_modules`).
2. Listo: ya trae las librerías, el `Stack` y la configuración de permisos. Seguí en el Paso 2.

### Opción B — Lo creo desde cero
1. Creá el proyecto (usamos **SDK 54**, la misma versión que el resto del curso):

```bash
npx create-expo-app@latest capacidadesNativas --template default@sdk-54
cd capacidadesNativas
npm run reset-project
```

   Cuando pregunte si querés mover los archivos de ejemplo a `app-example`, respondé **`n`** (los borra). Queda una carpeta `app/` casi vacía.

2. Instalá las tres librerías **con `expo install`** (no `npm install`: así elige la versión compatible con tu SDK):

```bash
npx expo install expo-camera expo-location expo-sensors
```

3. Reemplazá **`app/_layout.tsx`** por esto (el `Stack` con la pantalla principal):

```tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: "Capacidades Nativas" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
```

### Permisos en `app.json` (opcional)
- Con **Expo Go no tenés que tocar `app.json`**: los permisos se piden mientras la app corre.
- Se configuran cuando vas a **publicar** la app (Clase 13). Si querés dejarlo listo, agregá estas claves dentro de `"expo"` (en `plugins`, **sumá** a lo que ya hay, no lo reemplaces):

```json
"ios": {
  "infoPlist": {
    "NSCameraUsageDescription": "Esta app necesita acceso a la cámara para tomar fotos.",
    "NSLocationWhenInUseUsageDescription": "Esta app necesita tu ubicación para mostrar tu posición."
  }
},
"android": {
  "permissions": ["CAMERA", "ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]
},
"plugins": [
  "expo-router",
  ["expo-camera", { "cameraPermission": "Permite a la app acceder a tu cámara para tomar fotos." }],
  ["expo-location", { "locationWhenInUsePermission": "Permite a la app usar tu ubicación mientras está abierta." }]
]
```

### Revisá
- `package.json` debe tener `expo-camera`, `expo-location` y `expo-sensors` en `dependencies`.
- `app/_layout.tsx` y `app/index.tsx` existen.

✅ **Comprobá:** `npx expo start`, escaneás el QR y la app abre sin errores rojos.

---

## 🪜 Paso 2 — El menú de capacidades

Reemplazá **`app/index.tsx`**:

```tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Cada "id" coincide con el nombre de un archivo dentro de /app
// (camera.tsx -> /camera). Agregar una tarjeta nueva = agregar un objeto acá.
const capabilities = [
  {
    id: "camera",
    title: "Cámara",
    icon: "camera",
    color: "#FF6B6B",
    description: "Tomar fotos",
  },
  {
    id: "sensors",
    title: "Sensores",
    icon: "phone-portrait",
    color: "#45B7D1",
    description: "Acelerómetro y giroscopio",
  },
  {
    id: "location",
    title: "Ubicación",
    icon: "location",
    color: "#96CEB4",
    description: "GPS del dispositivo",
  },
];

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Capacidades nativas</Text>
        <Text style={styles.subtitle}>Seleccioná una capacidad para probarla</Text>
      </View>

      <View style={styles.grid}>
        {capabilities.map((capability) => (
          <TouchableOpacity
            key={capability.id}
            style={[styles.card, { borderLeftColor: capability.color }]}
            onPress={() => router.push(`/${capability.id}` as any)}
          >
            <Ionicons name={capability.icon as any} size={32} color={capability.color} />
            <Text style={styles.cardTitle}>{capability.title}</Text>
            <Text style={styles.cardDescription}>{capability.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  grid: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  cardDescription: {
    fontSize: 12,
    color: "#666",
  },
});
```

**Qué mirar:**
- `capabilities` es un **array de objetos** y `.map()` dibuja una tarjeta por cada uno (igual que la lista de usuarios).
- El `id` de cada objeto tiene que ser **igual al nombre del archivo** en `app/`: `camera` → `camera.tsx`.
- `Ionicons` ya viene con Expo, no hay que instalar nada.

✅ **Comprobá:** ves las tres tarjetas. Si tocás una, dice "Unmatched Route": es normal, todavía no existen las pantallas.

---

## 🪜 Paso 3 — La cámara

Creá **`app/camera.tsx`**:

```tsx
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [photo, setPhoto] = useState<string | null>(null);

  // permission: { granted, canAskAgain, status }  (null mientras carga)
  // requestPermission: dispara el diálogo nativo del sistema
  const [permission, requestPermission] = useCameraPermissions();

  // useRef: guardamos una referencia a la cámara para poder llamar takePictureAsync()
  const cameraRef = useRef<CameraView>(null);

  // 1. Escenario: el estado de los permisos todavía no se cargó
  if (!permission) {
    return <View style={styles.container} />;
  }

  // 2. Escenario: permiso denegado o todavía no pedido
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Ionicons name="camera-outline" size={64} color="#FF6B6B" />
          <Text style={styles.messageTitle}>Permiso de cámara requerido</Text>
          <Text style={styles.messageText}>Necesitamos acceso a tu cámara para tomar fotos</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Solicitar permiso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Alternar entre cámara trasera y frontal
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // takePictureAsync captura y devuelve la ubicación temporal del archivo
  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhoto(result.uri);
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto");
      console.log(error);
    }
  };

  // 3. Escenario: ya hay una foto -> vista previa
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
            <Text style={styles.buttonText}>Tomar otra foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4. Escenario: cámara lista
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      {/* CameraView no admite hijos: los controles se dibujan encima, como hermanos */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
  },
  previewActions: {
    padding: 20,
    backgroundColor: "#000",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
```

Y sumá la pantalla en **`app/_layout.tsx`**, dentro del `Stack`:

```tsx
<Stack.Screen name="camera" options={{ title: "Cámara" }} />
```

**Qué mirar:**
- `useCameraPermissions()` te da `permission` (el estado) y `requestPermission` (dispara el cartel del sistema).
- La pantalla tiene **4 escenarios, en orden**: cargando → sin permiso → foto sacada → cámara lista. Esa estructura la vas a repetir con cualquier permiso.
- `useRef` guarda una **referencia a la cámara** para poder llamar a `takePictureAsync()` (el mismo `useRef` de la Clase 06).
- `takePictureAsync` devuelve la **ruta temporal** de la foto (`uri`), que se muestra con `<Image>`.
- `CameraView` **no admite hijos**: por eso los botones están *al lado*, con `position: "absolute"`.

✅ **Comprobá:** la primera vez pide permiso → aceptás → ves la cámara → tocás el botón blanco → aparece la foto → "Tomar otra foto" vuelve a la cámara. Probá también el botón de **girar cámara**.

---

## 🪜 Paso 4 — Sensores

Creá **`app/sensors.tsx`**:

```tsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';

type SensorData = {
  x: number;
  y: number;
  z: number;
};

// Los sensores de movimiento solo existen en un celular: en el navegador (web)
// expo-sensors no los soporta y la pantalla se rompería. Probar siempre en Expo Go.
export default function SensorsScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webNotice}>
        <Ionicons name="phone-portrait-outline" size={64} color="#45B7D1" />
        <Text style={styles.title}>Solo disponible en el celular</Text>
        <Text style={styles.subtitle}>Abrí la app con Expo Go para usar el acelerómetro y el giroscopio.</Text>
      </View>
    );
  }
  return <SensorsContent />;
}

function SensorsContent() {
  const [accelerometerData, setAccelerometerData] = useState<SensorData | null>(null);
  const [gyroscopeData, setGyroscopeData] = useState<SensorData | null>(null);
  const [isActive, setIsActive] = useState({
    accelerometer: false,
    gyroscope: false,
  });

  // LIMPIEZA OBLIGATORIA: Los sensores siguen enviando datos en segundo plano
  // si no se remueven los listeners. Esto agotaría la batería.
  useEffect(() => {
    return () => {
      // removeAllListeners: Detiene todas las suscripciones al desmontar la pantalla
      Accelerometer.removeAllListeners();
      Gyroscope.removeAllListeners();
    };
  }, []);

  const startAccelerometer = () => {
    if (isActive.accelerometer) {
      stopAccelerometer();
      return;
    }

    // setUpdateInterval: Define cada cuántos milisegundos queremos recibir datos.
    // Un valor muy bajo (ej: 10ms) puede saturar el bridge de React Native.
    Accelerometer.setUpdateInterval(100); 
    
    // addListener: Crea una suscripción que ejecuta el callback con cada movimiento.
    Accelerometer.addListener((data) => {
      setAccelerometerData(data);
    });
    setIsActive(prev => ({ ...prev, accelerometer: true }));
  };

  const stopAccelerometer = () => {
    Accelerometer.removeAllListeners();
    setAccelerometerData(null);
    setIsActive(prev => ({ ...prev, accelerometer: false }));
  };

  const startGyroscope = () => {
    if (isActive.gyroscope) {
      stopGyroscope();
      return;
    }

    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener((data) => {
      setGyroscopeData(data);
    });
    setIsActive(prev => ({ ...prev, gyroscope: true }));
  };

  const stopGyroscope = () => {
    Gyroscope.removeAllListeners();
    setGyroscopeData(null);
    setIsActive(prev => ({ ...prev, gyroscope: false }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sensores del Dispositivo</Text>
        <Text style={styles.subtitle}>
          Activa un sensor para ver sus datos en tiempo real
        </Text>
      </View>

      {/* Acelerómetro */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="phone-portrait" size={32} color="#FF6B6B" />
          <Text style={styles.cardTitle}>Acelerómetro</Text>
          {isActive.accelerometer && (
            <View style={styles.activeIndicator}>
              <View style={[styles.activeDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.activeText}>Activo</Text>
            </View>
          )}
        </View>
        <View style={styles.dataContainer}>
          {accelerometerData ? (
            <>
              <Text style={styles.dataText}>X: {accelerometerData.x.toFixed(2)}</Text>
              <Text style={styles.dataText}>Y: {accelerometerData.y.toFixed(2)}</Text>
              <Text style={styles.dataText}>Z: {accelerometerData.z.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.dataPlaceholder}>Presiona para iniciar</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isActive.accelerometer ? '#666' : '#FF6B6B' }]}
          onPress={startAccelerometer}
        >
          <Ionicons name={isActive.accelerometer ? 'stop' : 'play'} size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isActive.accelerometer ? 'Detener' : 'Iniciar'} Acelerómetro
          </Text>
        </TouchableOpacity>
      </View>

      {/* Giroscopio */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="sync" size={32} color="#4ECDC4" />
          <Text style={styles.cardTitle}>Giroscopio</Text>
          {isActive.gyroscope && (
            <View style={styles.activeIndicator}>
              <View style={[styles.activeDot, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.activeText}>Activo</Text>
            </View>
          )}
        </View>
        <View style={styles.dataContainer}>
          {gyroscopeData ? (
            <>
              <Text style={styles.dataText}>X: {gyroscopeData.x.toFixed(2)}</Text>
              <Text style={styles.dataText}>Y: {gyroscopeData.y.toFixed(2)}</Text>
              <Text style={styles.dataText}>Z: {gyroscopeData.z.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.dataPlaceholder}>Presiona para iniciar</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isActive.gyroscope ? '#666' : '#4ECDC4' }]}
          onPress={startGyroscope}
        >
          <Ionicons name={isActive.gyroscope ? 'stop' : 'play'} size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isActive.gyroscope ? 'Detener' : 'Iniciar'} Giroscopio
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#45B7D1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dataContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  dataPlaceholder: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

Y en **`app/_layout.tsx`**:

```tsx
<Stack.Screen name="sensors" options={{ title: "Sensores" }} />
```

**Qué mirar:**
- `Accelerometer` mide el movimiento (sacudidas, inclinación). `Gyroscope` mide la rotación.
- `addListener(callback)` significa "avisame cada vez que haya un dato nuevo".
- `setUpdateInterval(100)` = un dato cada 100 ms. Valores muy bajos (como 10 ms) saturan la app.
- **La limpieza:** el `useEffect` con `return` corta los sensores al salir de la pantalla. Sin eso, siguen trabajando en segundo plano y gastan batería.
- `isActive` es un objeto con un booleano por sensor, para saber cuál está encendido.
- En el navegador la pantalla muestra un aviso en vez de romperse.

✅ **Comprobá:** "Iniciar Acelerómetro" y **sacudí el celular**: los números cambian. Con el celular apoyado plano, `Z` vale aproximadamente `1` (la gravedad). "Iniciar Giroscopio" y **girá** el celular. "Detener" frena los datos.

---

## 🪜 Paso 5 — Ubicación

Creá **`app/location.tsx`**:

```tsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  // FUNCIÓN PARA SOLICITAR PERMISO: La ubicación es crítica.
  // requestForegroundPermissionsAsync: Pide permiso para cuando la app está abierta.
  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted'); // status 'granted' significa que el usuario aceptó
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso de ubicación para esta funcionalidad');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al solicitar permisos');
    }
  };

  // FUNCIÓN PARA OBTENER COORDENADAS: este botón solo se muestra si el permiso fue concedido.
  const getCurrentLocation = async () => {
    setIsLoading(true);

    try {
      // getCurrentPositionAsync: Obtiene latitud, longitud y otros datos una sola vez.
      // accuracy: Define cuánta batería/tiempo usar para ser preciso.
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación. ¿Tienes el GPS encendido?');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Ionicons name="location-outline" size={64} color="#96CEB4" />
          <Text style={styles.messageTitle}>Permiso de Ubicación Requerido</Text>
          <Text style={styles.messageText}>
            Necesitamos acceso a tu ubicación para mostrar tu posición actual.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermissions}>
            <Text style={styles.buttonText}>Solicitar Permiso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="location" size={64} color="#96CEB4" />
        <Text style={styles.title}>Ubicación GPS</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={getCurrentLocation}
          disabled={isLoading}
        >
          <Ionicons name="locate" size={24} color="#fff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Obteniendo...' : 'Obtener Ubicación'}
          </Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.dataContainer}>
            <View style={styles.dataCard}>
              <Ionicons name="navigate" size={32} color="#96CEB4" />
              <Text style={styles.dataLabel}>Coordenadas</Text>
              <Text style={styles.dataValue}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.dataCard}>
              <Ionicons name="speedometer" size={32} color="#96CEB4" />
              <Text style={styles.dataLabel}>Precisión</Text>
              <Text style={styles.dataValue}>
                ±{location.coords.accuracy?.toFixed(0) || 'N/A'} metros
              </Text>
            </View>

            {location.coords.altitude && (
              <View style={styles.dataCard}>
                <Ionicons name="trending-up" size={32} color="#96CEB4" />
                <Text style={styles.dataLabel}>Altitud</Text>
                <Text style={styles.dataValue}>
                  {location.coords.altitude.toFixed(2)} metros
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 10,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#96CEB4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dataContainer: {
    width: '100%',
    marginTop: 30,
  },
  dataCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
});
```

Y en **`app/_layout.tsx`**:

```tsx
<Stack.Screen name="location" options={{ title: "Ubicación" }} />
```

**Qué mirar:**
- Acá el permiso se pide con una **función** (`requestForegroundPermissionsAsync`), no con un hook como en la cámara: son dos formas de hacer lo mismo.
- "Foreground" = mientras la app está abierta.
- `getCurrentPositionAsync` te da la posición **una sola vez**.
- `coords.accuracy` es el **margen de error en metros**: adentro de un edificio suele ser mayor que afuera.
- El `try / catch / finally` con `isLoading` es **el mismo patrón** que usaste en `useGetUsers`.

✅ **Comprobá:** aceptás el permiso → "Obtener Ubicación" → aparecen coordenadas y precisión. Pegá las coordenadas en Google Maps para ver si coinciden con tu lugar.

---

## 🔍 Revisión final

- [ ] El menú tiene tres tarjetas y cada una abre su pantalla.
- [ ] La cámara pide permiso, saca una foto y la muestra.
- [ ] El acelerómetro y el giroscopio muestran datos y se pueden detener.
- [ ] La ubicación muestra coordenadas y precisión.
- [ ] `npx tsc --noEmit` sin errores.
- [ ] Probaste a **negar** un permiso para ver qué pasa (la app no tiene que romperse).

---

## 🆘 Si algo no anda

| Qué pasa | Por qué | Qué hacer |
| :--- | :--- | :--- |
| **"Unmatched Route"** al tocar una tarjeta | El archivo no existe o el `id` no coincide con su nombre | `camera` → `camera.tsx`, `sensors` → `sensors.tsx`, `location` → `location.tsx` (todo en `app/`) |
| La cámara se ve negra | Estás en un emulador, o falta el permiso | Probá en un celular real |
| Siempre te pide permiso y no pasa nada | Lo negaste con "no volver a preguntar" | Ajustes del celular → Expo Go → Permisos |
| La ubicación tarda o da error | GPS apagado, o estás adentro de un edificio | Prendé el GPS y acercate a una ventana |
| Los sensores no funcionan en la compu | `expo-sensors` no existe en navegador | Usá Expo Go en el celular |
| Los números no cambian | No tocaste "Iniciar" | Tocá **Iniciar** |
| Cambié algo y no se actualiza | Cache de Metro | Cortá con Ctrl+C y corré `npx expo start -c` |

---

## 🌟 Para animarte (opcional)

1. **Vibración:** instalá `expo-haptics` y hacé vibrar el celular al sacar una foto.
2. **Sacudida:** calculá `Math.sqrt(x*x + y*y + z*z)` con el acelerómetro y mostrá un aviso cuando supere cierto valor.
3. **Dirección:** con `Location.reverseGeocodeAsync` mostrá calle y ciudad en vez de números.
4. **Tu propio hook:** sacá la lógica repetida de los sensores a `hooks/useSensor.ts`, como hiciste con `useGetUsers`.
5. **Modo oscuro:** reutilizá el `ThemeContext` de la Clase 07 en esta app.

---

## 📚 Lo que aprendiste

- **Acceso nativo:** usar cámara, sensores y GPS desde JavaScript con módulos de Expo.
- **Permisos:** preguntar → esperar → actuar, y qué hacer si dicen que no.
- **Escenarios de pantalla:** cargando / sin permiso / listo.
- **Sensores:** suscribirte con `addListener` y **limpiar** al salir.
- **`useRef`** como referencia a un componente (la cámara).
- **Un menú dirigido por datos:** un array + `map` + `router.push`.

---

**➡️ Próxima clase (09):** aprendemos a **guardar datos en el celular** (`AsyncStorage`). Por ejemplo, para que el modo oscuro de la Clase 07 no se pierda al cerrar la app. Guardá tu proyecto.
