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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Usuario</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Juan Pérez" />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="juanp"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="juan@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Usuario</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, backgroundColor: "#f8f9fa", borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 24, fontWeight: "bold" },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#28a745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#94d3a2" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
