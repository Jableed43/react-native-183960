import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function DetailsScreen({ route, navigation }: any) {
  const { item } = route.params || {};

  return (
    <ScreenWrapper title="Detalle del Item">
      <View style={styles.container}>
        <Text style={styles.placeholder}>
          {item ? `Recibido: ${item.title}` : 'No se recibió información del item'}
        </Text>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
          <Text style={styles.botonTexto}>Volver Atrás</Text>
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
