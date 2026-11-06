import { useTheme } from "@/features/theme/ThemeContext";
import { CreateUserData } from "@/features/users/api";
import { usePostUser } from "@/features/users/usePostUser";
import { UserForm } from "@/features/users/UserForm";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateUser() {
  const router = useRouter();
  const { saveUser, loading, error } = usePostUser();
  const { colors } = useTheme();

  // El formulario ya validó los datos; acá solo los enviamos y avisamos cómo salió.
  const handleSubmit = useCallback(
    async (data: CreateUserData) => {
      await saveUser(data);
      if (error) {
        // Antes, si el servidor fallaba, no pasaba nada y la persona no sabía por qué.
        Alert.alert("No se pudo crear el usuario");
        return;
      }
      Alert.alert("¡Éxito!", "Usuario creado correctamente");
      router.back();
    },
    [saveUser, router, error]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Nuevo Usuario</Text>
      </View>

      <UserForm submitLabel="Crear Usuario" loading={loading} onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
});
