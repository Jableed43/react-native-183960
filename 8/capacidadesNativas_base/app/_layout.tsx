import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: "Capacidades Nativas" }} />
        <Stack.Screen name="camera" options={{ title: "Cámara" }} />
        <Stack.Screen name="sensors" options={{ title: "Sensores" }} />
        <Stack.Screen name="location" options={{ title: "Ubicación" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
