import { StyleSheet, View, Text } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function ProfileScreen() {
  return (
    <ScreenWrapper title="Mi Perfil">
      <View style={styles.container}>
        <Text style={styles.placeholder}>Acá va la información del perfil</Text>
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
