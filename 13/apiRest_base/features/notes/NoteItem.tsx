/* eslint-disable react/display-name */
import { Note } from "@/features/notes/notes";
import { useTheme } from "@/features/theme/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated'

interface NoteItemProps {
  note: Note;
  onToggle: (note: Note) => void;
  onDelete: (id: string) => void;
}

// memo + funciones estables (useCallback en useNotes): la nota solo se redibuja si ella cambió.
export const NoteItem = memo(({ note, onToggle, onDelete }: NoteItemProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View 
    entering={FadeInDown.springify()}
    exiting={FadeOutRight}
    style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.content} onPress={() => onToggle(note)}>
        <Text style={styles.check}>{note.done ? "✅" : "⬜"}</Text>
        <View style={styles.texts}>
          <Text
            style={[
              styles.text,
              { color: note.done ? colors.textDisabled : colors.text },
              note.done && styles.textDone,
            ]}
          >
            {note.text}
          </Text>
          <Text style={[styles.author, { color: colors.textSecondary }]}>por {note.author}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(note.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    gap: 10,
  },
  content: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  check: { fontSize: 22 },
  texts: { flex: 1 },
  text: { fontSize: 16 },
  textDone: { textDecorationLine: "line-through" },
  author: { fontSize: 12, marginTop: 2 },
  delete: { fontSize: 20 },
});
