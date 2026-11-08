import { useTheme } from "@/features/theme/ThemeContext";
import { CreateUserData } from "@/features/users/api";
import { useGetUser } from "@/features/users/useGetUser";
import { useUpdateUser } from "@/features/users/useUpdateUser";
import { UserForm } from "@/features/users/UserForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditUser() {
  const router = useRouter();
  const { colors } = useTheme();
  // El id llega por la ruta: router.push({ pathname: "/edit-user", params: { id } })
  // Los parámetros de ruta siempre llegan como texto, por eso Number(...)
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = Number(id);

  const { user, loading: loadingUser, error: loadError } = useGetUser(userId);
  const { editUser, loading: saving } = useUpdateUser();

  const handleSubmit = useCallback(
    async (data: CreateUserData) => {
      const errorMessage = await editUser(userId, data);
      if (errorMessage) {
        Alert.alert("No se pudo guardar", errorMessage);
        return;
      }
      Alert.alert("¡Listo!", "Usuario actualizado");
      router.back();
    },
    [editUser, userId, router]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Editar Usuario</Text>
      </View>

      {loadingUser ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : loadError || !user ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.error }]}>{loadError ?? "No se encontró el usuario"}</Text>
        </View>
      ) : (
        // Mostramos el formulario recién cuando el usuario ya llegó, así arranca con sus datos.
        <UserForm
          initialValues={{ name: user.name, username: user.username, email: user.email }}
          submitLabel="Guardar cambios"
          loading={saving}
          onSubmit={handleSubmit}
        />
      )}
    </SafeAreaView>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  errorText: { fontSize: 16, textAlign: "center" },
});
