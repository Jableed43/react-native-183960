import { User } from "@/constants/api";
import { useTheme } from "@/context/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface UserCardProps {
  user: User;
}

// React.memo evita re-renders por cambios de PROPS, pero NO bloquea los de Context:
// si cambia el tema, UserCard se vuelve a pintar igual (y es lo que queremos).
export const UserCard = memo(({ user }: UserCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.userItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
      <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
    </View>
  );
});

// Los estilos fijos (tamaños, márgenes) quedan acá; los colores vienen del theme.
const styles = StyleSheet.create({
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    marginTop: 4,
  },
});
