import { useSession } from "@/context/SessionContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

export default function Login() {
  const { colors } = useTheme();
  const { login } = useSession();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // --- Animación a medida: "sacudida" cuando hay un error ---
  const x = useSharedValue(0);
  const shake = () => {
    x.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 4, true),
      withTiming(0, { duration: 50 })
    );
  };
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const handleLogin = () => {
    if (!name.trim()) {
      setError("Escribí tu nombre para entrar");
      shake(); // el feedback visual refuerza el error
      return;
    }
    setError("");
    // Al cambiar la sesión, el Stack.Protected del _layout nos lleva solo a la app.
    login(name);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Entrada: la tarjeta "crece" con un rebote */}
      <Animated.View entering={ZoomIn.springify()} style={styles.wrapper}>
        {/* Sacudida: va en otra capa para no pisar la animación de entrada */}
        <Animated.View style={[styles.card, { backgroundColor: colors.card }, shakeStyle]}>
          <Text style={[styles.title, { color: colors.text }]}>Bienvenido 👋</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Escribí tu nombre para entrar</Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: error ? colors.error : colors.inputBorder,
                color: colors.inputText,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Ana"
            placeholderTextColor={colors.textDisabled}
            autoCapitalize="words"
            onSubmitEditing={handleLogin}
          />
          {error !== "" && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin}>
            <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Entrar</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Solo estructura: los colores se aplican arriba con useTheme().
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  wrapper: { width: "100%", maxWidth: 400 },
  card: { borderRadius: 16, padding: 24, gap: 12 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 8 },
  input: { height: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  error: { fontSize: 13 },
  button: { height: 48, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 4 },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
