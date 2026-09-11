import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
    <Text style={styles.titulo}>
    Mi aplicacion
    </Text>
    <Text style={styles.subtitulo}>
      Listo para comenzar
    </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },
  subtitulo: {
    fontSize: 16,
    color: "gray"
  }
});
