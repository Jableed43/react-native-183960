import { useSession, SessionProvider } from "@/context/SessionContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Este componente existe porque useTheme solo funciona DENTRO del Provider.
// RootLayout es quien lo monta, así que no puede consumirlo a la vez.
function RootLayoutNav() {
  const { theme, colors } = useTheme();
  const { user, isReady } = useSession();

  if (!isReady) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="create-user"
            options={{ title: "Nuevo usuario" }}
          />
        </Stack.Protected>
        {/* TODO -> stack para LOGIN */}
        <Stack.Protected guard={!user}>
          <Stack.Screen
            name="login"
            options={{ headerShown: false, animation: "fade" }}
          />
        </Stack.Protected>
      </Stack>
      {/* Fondo oscuro -> íconos claros, y viceversa */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <SessionProvider>
          <RootLayoutNav />
        </SessionProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
