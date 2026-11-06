import { User } from "@/features/users/api";
import { useTheme } from "@/features/theme/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated"

interface UserCardProps {
  user: User;
  index: number;
}

// React.memo evita re-renders por cambios de PROPS, pero NO bloquea los de Context:
// si cambia el tema, UserCard se vuelve a pintar igual (y es lo que queremos).
export const UserCard = memo(({ user, index }: UserCardProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View 
    // efecto cascada, cada tarjeta espera un poquito mas que la anterior, las ultimas esperan mas para aparecer
    entering={FadeInDown.delay(Math.min(index, 8) * 70).springify()}
    style={[styles.userItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
      <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
    </Animated.View>
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
