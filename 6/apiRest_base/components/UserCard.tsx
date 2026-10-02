import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { User } from "@/constants/api";

interface UserCardProps {
  user: User;
}

// React.memo: si "user" es el mismo objeto que en el render anterior,
// UserCard NO se vuelve a ejecutar. Junto con useCallback en el padre,
// evita re-renderizar los 10, 50 o 100 items de la lista sin necesidad.
export const UserCard = memo(({ user }: UserCardProps) => (
  <View style={styles.userItem}>
    <Text style={styles.userName}>{user.name}</Text>
    <Text style={styles.userEmail}>{user.email}</Text>
  </View>
));

const styles = StyleSheet.create({
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
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
