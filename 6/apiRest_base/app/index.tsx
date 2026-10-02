import { UserCard } from "@/components/UserCard";
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
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo conectar: {error}</Text>
        <Button title="Reintentar" onPress={getUsers} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lista de usuarios</Text>
          <Text style={styles.renderText}>Renders: {renderCount.current}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleGoToCreate}>
          <Text style={styles.addButtonText}>+ Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5d5da3" />
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
              <Text>No hay usuarios disponibles.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  renderText: { fontSize: 12, color: "#666", fontStyle: "italic" },
  addButton: { backgroundColor: "#007bff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  searchContainer: { padding: 10, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  searchInput: { height: 40, backgroundColor: "#f1f3f5", borderRadius: 8, paddingHorizontal: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "rgb(207, 107, 107)", marginBottom: 10, textAlign: "center" },
});
