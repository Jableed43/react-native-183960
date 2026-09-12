import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

// Pantallas importadas (Navegador principal)
import TabNavigator from "./navigation/TabNavigator";

/**
 * App: Punto de entrada principal de la aplicación.
 * 
 * Aquí configuramos los "Providers", que son componentes que proveen 
 * funcionalidades a toda la aplicación (estilos, áreas seguras, etc).
 */
export default function App() {
  return (
    /* SafeAreaProvider: Necesario para que SafeAreaView funcione correctamente. */
    <SafeAreaProvider>
      {/* PaperProvider: Aplica el tema de Material Design de React Native Paper. */}
      <PaperProvider theme={MD3LightTheme}>
        {/* StatusBar: Controla la barra de estado del teléfono (hora, batería, etc). */}
        <StatusBar style="dark" />
        {/* TabNavigator: El componente que maneja la navegación principal. */}
        <TabNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
