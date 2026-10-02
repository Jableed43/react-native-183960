import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { User } from "@/constants/api";

interface UserCardProps {
  user: User;
}

// Todavía SIN React.memo: se re-crea y se vuelve a dibujar en cada render de la lista,
// aunque el usuario que muestra no haya cambiado. Lo arreglamos en el Paso 5.
export const UserCard = ({ user }: UserCardProps) => (
  <View style={styles.userItem}>
    <Text style={styles.userName}>{user.name}</Text>
    <Text style={styles.userEmail}>{user.email}</Text>
  </View>
);

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
