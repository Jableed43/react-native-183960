import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tipamos la tarea
// sumar interface en el resumen
interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
}

export default function TodoList() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  // Funcionalidad

  // cuantas tareas pendientes hay?
  const tareasPendientes = tareas.filter(
    (tarea: Tarea) => !tarea.completada,
  ).length;

  // Funcionalidad de agregar una tarea
  const agregarTarea = () => {
    if (nuevaTarea.trim()) {
      const nueva: Tarea = {
        id: Date.now().toString(),
        texto: nuevaTarea.trim(),
        completada: false,
      };
      // spread operator
      setTareas([...tareas, nueva]);
      // limpia el input y lo dejo vacio
      setNuevaTarea("");
    }
  };

  // Completar la tarea - marcarla como incompleta
  const toggleTarea = (id: string) => {
    setTareas(
      tareas.map((tarea: Tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea,
      ),
    );
  };

  const eliminarTarea = (id: string) => {
    setTareas(tareas.filter((tarea: Tarea) => tarea.id !== id));
  };

  const renderItem = ({ item }: { item: Tarea }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => toggleTarea(item.id)}
      >
        <View
          style={[
            styles.checkbox,
            item.completada && styles.checkboxCompletado,
          ]}
        >
          {item.completada && <Text style={styles.checkmark}> ✔ </Text>}
        </View>
        <Text style={[styles.textoTarea, item.completada && styles.textoTareaCompletado]} > {item.texto} </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => eliminarTarea(item.id)}>
        <Text style={styles.textoEliminar}> 🗑 </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Mi lista de tareas</Text>

      {/* // template literals */}
      {/* backsticks */}
      <Text>
        {`${tareasPendientes} pendiente${tareasPendientes !== 1 ? "s" : ""}`}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una tarea..."
          value={nuevaTarea}
          onChangeText={setNuevaTarea}
        />

        <TouchableOpacity style={styles.boton} onPress={agregarTarea}>
          <Text style={styles.botonTexto}> + </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tareas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  titulo: { fontSize: 24, fontWeight: "bold" },
  contador: { fontSize: 16, color: "#666", marginBottom: 20 },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  boton: {
    backgroundColor: "#007AFF",
    padding: 15,
    marginLeft: 10,
    borderRadius: 5,
  },
  botonTexto: { color: "white", fontWeight: "bold" },
  itemContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  item: { flex: 1, flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompletado: { backgroundColor: "#007AFF" },
  checkmark: { color: "white", fontSize: 14 },
  textoTarea: { fontSize: 16 },
  textoTareaCompletado: { textDecorationLine: "line-through", color: "#aaa" },
  textoEliminar: { fontSize: 20, marginLeft: 10 },
});
