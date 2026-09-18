import { useGetUsers } from "@/hooks/useGetUsers";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  // destructuracion de objetos
  const { error, getUsers, loading, users } = useGetUsers();

  const renderContent = () => {
    if (error) {
      return (
        <View>
          <Text>No se pudo conectar: {error}</Text>
          <Button title="Reintentar" onPress={getUsers} />
        </View>
      );
    }

    if (loading && users.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5d5da3" />
        </View>
      );
    }

    return (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}> {item.name} </Text>
            <Text style={styles.userEmail}> {item.email} </Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={getUsers} // vuelve a llamar a la api
        // empty state
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text> No hay usuarios disponibles </Text>
          </View>
        }
      ></FlatList>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}> Lista de usuarios </Text>

        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  formToggle: {
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "rgb(207, 107, 107)",
    marginBottom: 10,
    textAlign: "center",
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#666",
    marginTop: 4,
  },
});
