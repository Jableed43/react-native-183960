import { UserCard } from "@/components/UserCard";
import { useTheme } from "@/context/ThemeContext";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  // destructuracion de objetos
  const { error, getUsers, loading, users } = useGetUsers();
  const [search, setSearch] = useState("");
  // Context API: leemos el tema global sin recibir ninguna prop.
  const { theme, colors, toggleTheme } = useTheme();

  // Se ejecuta cada vez que esta pantalla gana foco: al abrirla y también
  // al volver desde create-user (a diferencia de useEffect, que solo corre una vez).
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [getUsers])
  );

  // useRef: memoria silenciosa. Cambiarla NO dispara un re-render.
  const renderCount = useRef(0);
  renderCount.current++;

  // useMemo: recalcula el filtro solo si cambian "users" o "search".
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // useCallback: identidad estable para el botón de navegación.
  const handleGoToCreate = useCallback(() => {
    router.push("/create-user");
  }, [router]);

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>No se pudo conectar: {error}</Text>
        <Button title="Reintentar" onPress={getUsers} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Lista de usuarios</Text>
          <Text style={[styles.renderText, { color: colors.textSecondary }]}>Renders: {renderCount.current}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeButtonText}>{theme === "light" ? "🌙" : "☀️"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleGoToCreate}>
            <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>+ Nuevo Usuario</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.inputBackground, color: colors.inputText }]}
          placeholder="Buscar usuario..."
          placeholderTextColor={colors.textDisabled}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <UserCard user={item} />}
          refreshing={loading}
          onRefresh={getUsers}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: colors.textSecondary }}>No hay usuarios disponibles.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Solo estructura: los colores se aplican arriba con useTheme().
  container: { flex: 1 },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 22, fontWeight: "bold" },
  renderText: { fontSize: 12, fontStyle: "italic" },
  themeButton: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  themeButtonText: { fontSize: 18 },
  addButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { fontWeight: "600" },
  searchContainer: { padding: 10, borderBottomWidth: 1 },
  searchInput: { height: 40, borderRadius: 8, paddingHorizontal: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { marginBottom: 10, textAlign: "center" },
});
