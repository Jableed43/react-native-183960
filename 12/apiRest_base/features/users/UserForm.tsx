import { CreateUserData } from "@/features/users/api";
import { useTheme } from "@/features/theme/ThemeContext";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface UserFormProps {
  initialValues?: CreateUserData; // si viene, el formulario arranca con estos datos (modo "editar")
  submitLabel: string; // texto del botón: "Crear usuario" / "Guardar cambios"
  loading: boolean; // mientras se envía, el botón se desactiva
  onSubmit: (data: CreateUserData) => void; // se llama SOLO si los datos son válidos
}

type Errors = Partial<Record<"name" | "username" | "email", string>>;

// Un email "válido" para este curso: algo + @ + algo + . + algo (ej: ana@mail.com)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulario de usuario REUTILIZABLE: lo usan "Nuevo usuario" y "Editar usuario".
 * Antes cada pantalla tenía su propio formulario; ahora hay uno solo y las validaciones viven acá.
 */
export function UserForm({ initialValues, submitLabel, loading, onSubmit }: UserFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [username, setUsername] = useState(initialValues?.username ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const result: Errors = {};
    if (!name.trim()) result.name = "El nombre es obligatorio";
    if (!username.trim()) result.username = "El username es obligatorio";
    if (!email.trim()) result.email = "El email es obligatorio";
    else if (!EMAIL_REGEX.test(email.trim())) result.email = "Ingresá un email válido (ej: ana@mail.com)";
    return result;
  };

  const handleSubmit = () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return; // hay errores: no enviamos nada
    onSubmit({ name: name.trim(), username: username.trim(), email: email.trim() });
  };

  // Los inputs comparten colores; el borde pasa a rojo si el campo tiene error.
  const inputStyle = (field: keyof Errors) => [
    styles.input,
    {
      backgroundColor: colors.inputBackground,
      borderColor: errors[field] ? colors.error : colors.inputBorder,
      color: colors.inputText,
    },
  ];

  return (
    <View style={styles.form}>
      <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
      <TextInput
        style={inputStyle("name")}
        value={name}
        onChangeText={setName}
        placeholder="Juan Pérez"
        placeholderTextColor={colors.textDisabled}
      />
      {errors.name && <Text style={[styles.error, { color: colors.error }]}>{errors.name}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Username</Text>
      <TextInput
        style={inputStyle("username")}
        value={username}
        onChangeText={setUsername}
        placeholder="juanp"
        placeholderTextColor={colors.textDisabled}
        autoCapitalize="none"
      />
      {errors.username && <Text style={[styles.error, { color: colors.error }]}>{errors.username}</Text>}

      <Text style={[styles.label, { color: colors.text }]}>Email</Text>
      <TextInput
        style={inputStyle("email")}
        value={email}
        onChangeText={setEmail}
        placeholder="juan@mail.com"
        placeholderTextColor={colors.textDisabled}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={[styles.error, { color: colors.error }]}>{errors.email}</Text>}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: loading ? colors.successDisabled : colors.success }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.onPrimary }]}>{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 12 },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16 },
  error: { fontSize: 13, marginTop: 6 },
  button: { height: 50, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 24 },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});
