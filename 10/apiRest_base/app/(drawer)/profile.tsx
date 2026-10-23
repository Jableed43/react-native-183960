import { useTheme } from "@/context/ThemeContext";
import { useStoredState } from "@/hooks/useStoredState";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

// Pantalla del menú lateral. Muestra tres animaciones de entrada distintas.
export default function Profile() {
  const { theme, colors, toggleTheme } = useTheme();
  // El mismo nombre que se guarda desde la pantalla de Notas (misma clave en AsyncStorage)
  const [author, setAuthor] = useStoredState("@apiRest:author", "");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ZoomIn: el avatar "crece" desde cero con un pequeño rebote */}
      <Animated.View
        entering={ZoomIn.duration(5000)}
        style={[styles.avatar, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.avatarText, { color: colors.onPrimary }]}>{author.trim() ? author.trim()[0].toUpperCase() : "?"}</Text>
      </Animated.View>

      {/* Cada bloque entra un poquito después del anterior: delay escalonado */}
      <Animated.Text entering={FadeInDown.delay(1500)} style={[styles.title, { color: colors.text }]}>
        Hola, {author.trim() || "invitado"} 👋
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(3000)} style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Tu nombre</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.inputText },
          ]}
          value={author}
          onChangeText={setAuthor}
          placeholder="Ej: Ana"
          placeholderTextColor={colors.textDisabled}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(4500)}
        style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.rowText, { color: colors.text }]}>Modo oscuro</Text>
        <Switch value={theme === "dark"} onValueChange={toggleTheme} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Solo estructura: los colores se aplican arriba con useTheme().
  container: { flex: 1, alignItems: "center", padding: 24, gap: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, justifyContent: "center", alignItems: "center", marginTop: 24 },
  avatarText: { fontSize: 40, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold" },
  field: { alignSelf: "stretch" },
  label: { fontSize: 12, marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
  },
  rowText: { fontSize: 16 },
});
