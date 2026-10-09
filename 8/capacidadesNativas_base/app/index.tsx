import { StyleSheet, Text, View } from "react-native";

// Punto de partida: pantalla vacía. En clase construimos el menú de capacidades acá.
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capacidades nativas</Text>
      <Text style={styles.subtitle}>Seleccioná una capacidad para probarla</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666" },
});
