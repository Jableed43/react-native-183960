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
