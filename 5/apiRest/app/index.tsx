import { UserCard } from "@/components/UserCard";
import UseRefExample from "@/components/UseRefExample";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

  // Sin useMemo: esta función se vuelve a ejecutar en CADA render,
  // aunque "users" y "search" sigan siendo los mismos.
  const getFilteredUsers = () => {
    if (!search.trim()) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Todavía sin useCallback: se recrea en cada render de Index.
  const handleGoToCreate = () => {
    router.push("/create-user");
  };

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
        <Text style={styles.title}>Lista de usuarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleGoToCreate}>
          <Text style={styles.addButtonText}>+ Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      {/* Input de búsqueda para demostrar useMemo más adelante */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* <UseRefExample /> */}

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5d5da3" />
        </View>
      ) : (
        <FlatList
          // style={ { flexDirection: "column-reverse" } }
          data={getFilteredUsers()}
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
  addButton: { backgroundColor: "#007bff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  searchContainer: { padding: 10, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  searchInput: { height: 40, backgroundColor: "#f1f3f5", borderRadius: 8, paddingHorizontal: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "rgb(207, 107, 107)", marginBottom: 10, textAlign: "center" },
});
