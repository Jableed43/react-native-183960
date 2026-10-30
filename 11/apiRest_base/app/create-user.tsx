import { useTheme } from "@/context/ThemeContext";
import { usePostUser } from "@/hooks/usePostUser";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateUser() {
  const router = useRouter();
  const { saveUser, loading } = usePostUser();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // useCallback: identidad estable para el botón de envío.
  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !username.trim() || !email.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const success = await saveUser({ name: name.trim(), username: username.trim(), email: email.trim() });
    if (success) {
      Alert.alert("¡Éxito!", "Usuario creado correctamente");
      router.back();
    }
  }, [name, username, email, saveUser, router]);

  // Los 3 inputs comparten los mismos colores: los armamos una sola vez.
  const inputThemeStyle = {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Nuevo Usuario</Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
        <TextInput
          style={[styles.input, inputThemeStyle]}
          value={name}
          onChangeText={setName}
          placeholder="Juan Pérez"
          placeholderTextColor={colors.textDisabled}
        />

        <Text style={[styles.label, { color: colors.text }]}>Username</Text>
        <TextInput
          style={[styles.input, inputThemeStyle]}
          placeholderTextColor={colors.textDisabled}
          value={username}
          onChangeText={setUsername}
          placeholder="juanp"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, inputThemeStyle]}
          placeholderTextColor={colors.textDisabled}
          value={email}
          onChangeText={setEmail}
          placeholder="juan@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: loading ? colors.successDisabled : colors.success }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Crear Usuario</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});
