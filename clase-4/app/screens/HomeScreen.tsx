import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScreenWrapper title="Lista de Items">
      <View style={styles.container}>
        <Text style={styles.placeholder}>Acá va la lista de items (FlatList)</Text>

        {/* Botón de ejemplo para poder probar la navegación al detalle en vivo */}
        <TouchableOpacity
          style={styles.boton}
          onPress={() =>
            navigation.navigate('Details', {
              item: { id: 1, title: 'Item de prueba', description: 'Descripción de prueba' },
            })
          }
        >
          <Text style={styles.botonTexto}>Ver detalle (ejemplo)</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
