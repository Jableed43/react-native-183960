import { useTheme } from "@/features/theme/ThemeContext";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Este componente existe porque useTheme solo funciona DENTRO del Provider.
// RootLayout es quien lo monta, así que no puede consumirlo a la vez.
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDisabled,
          tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
          sceneStyle: { backgroundColor: colors.background },
          animation: "fade"
        }}
      > 
      <Tabs.Screen
        name="index"
        options={{
          title: "Usuarios",
          tabBarIcon: ({color, size}) => <Ionicons name="people-outline" color={color} size={size} />
        }}
      />

        <Tabs.Screen
        name="notes"
        options={{
          title: "Notas",
          tabBarIcon: ({color, size}) => <Ionicons name="cloud-outline" color={color} size={size} />
        }}
      />
      </Tabs>
  );
}
