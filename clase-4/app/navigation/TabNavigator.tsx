import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

// createBottomTabNavigator: Crea un componente de navegación por pestañas en la parte inferior.
const Tab = createBottomTabNavigator();

/**
 * TabNavigator: Navegación horizontal principal de la aplicación.
 * Cada pestaña (Screen) carga un componente diferente.
 */
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#6200ee", // Color para la pestaña activa
        tabBarInactiveTintColor: "gray", // Color para la pestaña inactiva
        headerShown: false, // Ocultamos el header aquí porque los manejamos dentro de cada stack.
      }}
    >
      {/* 
        IMPORTANTE: Al registrar un componente aquí (como HomeStack o ProfileScreen),
        el Tab.Navigator le "inyecta" automáticamente las props 'navigation' y 'route'.
        No necesitas pasárselas manualmente.
      */}

      {/* 1. Inicio (Carga un Stack Navigator anidado para poder navegar en profundidad) */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: "Inicio",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {/* 2. Perfil (Muestra directamente una pantalla) */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      {/* 3. Configuración (Muestra directamente una pantalla) */}
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: "Configuración",
          tabBarLabel: "Configuración",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
