/* eslint-disable react/display-name */
import { User } from "@/features/users/api";
import { useTheme } from "@/features/theme/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface UserCardProps {
  user: User;
  index: number; // posición en la lista: sirve para escalonar la animación de entrada
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// React.memo evita re-renders por cambios de PROPS, pero NO bloquea los de Context:
// si cambia el tema, UserCard se vuelve a pintar igual (y es lo que queremos).
// Las funciones onEdit / onDelete vienen con useCallback desde la pantalla (Clase 06),
// por eso memo sigue sirviendo: sus props no cambian en cada render.
export const UserCard = memo(({ user, index, onEdit, onDelete }: UserCardProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 70).springify()}
      style={[styles.userItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      <View style={styles.info}>
        <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(user)} accessibilityLabel={`Editar a ${user.name}`}>
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(user)} accessibilityLabel={`Eliminar a ${user.name}`}>
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

// Los estilos fijos (tamaños, márgenes) quedan acá; los colores vienen del theme.
const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    gap: 12,
  },
  info: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { marginTop: 4 },
  actions: { flexDirection: "row", gap: 16 },
  actionIcon: { fontSize: 20 },
});
