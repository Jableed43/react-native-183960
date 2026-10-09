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
