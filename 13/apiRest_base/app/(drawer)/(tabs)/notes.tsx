import { NoteItem } from "@/features/notes/NoteItem";
import { useTheme } from "@/features/theme/ThemeContext";
import { useNotes } from "@/features/notes/useNotes";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { LinearTransition } from "react-native-reanimated"
import { useSession } from "@/features/session/SessionContext";

export default function Notes() {
  const { colors } = useTheme();
  const { notes, loading, error, offline, addNote, toggleNote, deleteNote } = useNotes();

  // Guardado LOCAL (AsyncStorage): el nombre queda en el celular y no hay que escribirlo cada vez.
  // const [author, setAuthor] = useStoredState("@apiRest:author", "");

  // El autor ya no se pregunta: sale de la sesión (la persona que inició sesión en el login).
  const { user } = useSession();

  // Estado normal: el texto de la nota nueva no hace falta guardarlo.
  const [text, setText] = useState("");

  const canAdd = text.trim() !== "";

  const handleAdd = useCallback(() => {
    if (!canAdd) return;
    // Guardado en la NUBE: la nota viaja a Firestore.
    // Limpiamos el campo enseguida (Firestore la guarda y la sincroniza en segundo plano).
    addNote(text.trim(), user ?? "invitado");
    setText("");
  }, [canAdd, addNote, text, user]);

  const inputThemeStyle = {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right"]}>
      <View style={[styles.form, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Escribiendo como {user} - la nota se guarda en la nube</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.rowInput, inputThemeStyle]}
            value={text}
            onChangeText={setText}
            placeholder="Escribí una nota..."
            placeholderTextColor={colors.textDisabled}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: canAdd ? colors.primary : colors.textDisabled }]}
            onPress={handleAdd}
            disabled={!canAdd}
          >
            <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {offline && !error && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.error }]}>
          <Text style={[styles.offlineText, { color: colors.onPrimary }]}>
            ⚠️ Sin conexión con Firebase: lo que escribas NO se está guardando en la nube. Revisá el .env, que Firestore esté creado y tu internet.
          </Text>
        </View>
      )}

      {error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.error }]}>No se pudo conectar con Firebase</Text>
          <Text style={{ color: colors.textSecondary, textAlign: "center" }}>{error}</Text>
          <Text style={[styles.hint, { color: colors.textDisabled }]}>
            Revisá el archivo .env y las reglas de Firestore. Después reiniciá con: npx expo start -c
          </Text>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <Animated.FlatList
          itemLayoutAnimation={LinearTransition}
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteItem note={item} onToggle={toggleNote} onDelete={deleteNote} />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: colors.textSecondary }}>Todavía no hay notas. ¡Escribí la primera!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Solo estructura: los colores se aplican arriba con useTheme().
  container: { flex: 1 },
  form: { padding: 16, borderBottomWidth: 1 },
  label: { fontSize: 12, marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12, fontSize: 16 },
  row: { flexDirection: "row", gap: 8 },
  rowInput: { flex: 1, marginBottom: 0 },
  addButton: { paddingHorizontal: 16, borderRadius: 8, justifyContent: "center" },
  addButtonText: { fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 8 },
  errorText: { fontSize: 16, fontWeight: "600" },
  hint: { fontSize: 12, textAlign: "center", marginTop: 8 },
  offlineBanner: { padding: 10 },
  offlineText: { fontSize: 12, textAlign: "center" },
});
