import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  // FUNCIÓN PARA SOLICITAR PERMISO: La ubicación es crítica.
  // requestForegroundPermissionsAsync: Pide permiso para cuando la app está abierta.
  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted'); // status 'granted' significa que el usuario aceptó
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso de ubicación para esta funcionalidad');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al solicitar permisos');
    }
  };

  // FUNCIÓN PARA OBTENER COORDENADAS: este botón solo se muestra si el permiso fue concedido.
  const getCurrentLocation = async () => {
    setIsLoading(true);

    try {
      // getCurrentPositionAsync: Obtiene latitud, longitud y otros datos una sola vez.
      // accuracy: Define cuánta batería/tiempo usar para ser preciso.
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación. ¿Tienes el GPS encendido?');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Ionicons name="location-outline" size={64} color="#96CEB4" />
          <Text style={styles.messageTitle}>Permiso de Ubicación Requerido</Text>
          <Text style={styles.messageText}>
            Necesitamos acceso a tu ubicación para mostrar tu posición actual.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermissions}>
            <Text style={styles.buttonText}>Solicitar Permiso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="location" size={64} color="#96CEB4" />
        <Text style={styles.title}>Ubicación GPS</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={getCurrentLocation}
          disabled={isLoading}
        >
          <Ionicons name="locate" size={24} color="#fff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Obteniendo...' : 'Obtener Ubicación'}
          </Text>
        </TouchableOpacity>

        {location && (
          <View style={styles.dataContainer}>
            <View style={styles.dataCard}>
              <Ionicons name="navigate" size={32} color="#96CEB4" />
              <Text style={styles.dataLabel}>Coordenadas</Text>
              <Text style={styles.dataValue}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.dataCard}>
              <Ionicons name="speedometer" size={32} color="#96CEB4" />
              <Text style={styles.dataLabel}>Precisión</Text>
              <Text style={styles.dataValue}>
                ±{location.coords.accuracy?.toFixed(0) || 'N/A'} metros
              </Text>
            </View>

            {location.coords.altitude && (
              <View style={styles.dataCard}>
                <Ionicons name="trending-up" size={32} color="#96CEB4" />
                <Text style={styles.dataLabel}>Altitud</Text>
                <Text style={styles.dataValue}>
                  {location.coords.altitude.toFixed(2)} metros
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 10,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#96CEB4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dataContainer: {
    width: '100%',
    marginTop: 30,
  },
  dataCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
});
