import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Este componente existe porque useTheme solo funciona DENTRO del Provider.
// RootLayout es quien lo monta, así que no puede consumirlo a la vez.
function RootLayoutNav() {
  const { theme, colors } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Usuarios" }} />
        <Stack.Screen name="create-user" options={{ title: "Nuevo usuario" }} />
      </Stack>
      {/* Fondo oscuro -> íconos claros, y viceversa */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
