import { StyleSheet, View, Text } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function SettingsScreen() {
  return (
    <ScreenWrapper title="Configuración">
      <View style={styles.container}>
        <Text style={styles.placeholder}>Acá van las opciones de configuración</Text>
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
  },
});
