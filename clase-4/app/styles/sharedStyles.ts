import { StyleSheet } from "react-native";

// Constantes para mantener consistencia y facilitar cambios globales
export const SPACING = 16;
export const RADIUS = 12; // Bordes más redondeados (estilo Material 3)

export const sharedStyles = StyleSheet.create({
  // 1. Contenedores Base
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Fondo gris neutro para que resalten las Cards blancas
  },
  content: {
    flex: 1,
    padding: SPACING,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  // 2. Tipografía (Jerarquía Visual)
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: SPACING,
    color: "#1d1b20",
  },
  subtitle: {
    fontSize: 16,
    color: "#49454f",
    marginBottom: 8,
  },

  // 3. Estilo de Card (Propiedades de estilo para Card de Paper)
  card: {
    marginBottom: SPACING,
    borderRadius: RADIUS,
    elevation: 2, // Sutil elevación Material 3
    backgroundColor: "#fff",
    borderWidth: 0,
  },

  // 4. Posicionado FAB
  fab: {
    position: "absolute",
    margin: SPACING,
    right: 0,
    bottom: 0,
    backgroundColor: "#d0bcff", // Un violeta suave tipo Material 3
  },
});
