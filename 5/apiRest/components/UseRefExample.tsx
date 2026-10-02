import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Demo aislada para VER la diferencia entre useState y useRef antes de tocar
 * el código real. No forma parte de la app final: se saca al terminar el Paso 4.
 */
const UseRefExample = () => {
  // 1. Estado tradicional (dispara re-render)
  const [renderCount, setRenderCount] = useState(0);

  // 2. Ref (NO dispara re-render)
  const silentCounter = useRef(0);

  const incrementRef = () => {
    silentCounter.current += 1;
    console.log("Valor del Ref (en consola):", silentCounter.current);
    // El número sube en la consola, ¡pero en la pantalla no!
  };

  const forceRender = () => {
    setRenderCount(renderCount + 1);
    // Al cambiar el estado, el componente se redibuja y "descubrimos"
    // el valor actual que tenía el Ref.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>useRef vs useState</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Contador con Ref (silencioso):</Text>
        <Text style={styles.value}>{silentCounter.current}</Text>
        <TouchableOpacity style={styles.buttonRef} onPress={incrementRef}>
          <Text style={styles.buttonText}>Incrementar Ref</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Mirá la consola: el Ref cambia pero la pantalla no.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Renderizados totales:</Text>
        <Text style={[styles.value, { color: "#007AFF" }]}>{renderCount}</Text>
        <TouchableOpacity style={styles.buttonState} onPress={forceRender}>
          <Text style={styles.buttonText}>Forzar Render (useState)</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Al presionar esto, el valor del Ref se actualiza en pantalla.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5", borderRadius: 15, margin: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: { fontSize: 16, color: "#333" },
  value: { fontSize: 32, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
  buttonRef: { backgroundColor: "#34C759", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonState: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  hint: { fontSize: 12, color: "#666", marginTop: 8, fontStyle: "italic" },
});

export default UseRefExample;
