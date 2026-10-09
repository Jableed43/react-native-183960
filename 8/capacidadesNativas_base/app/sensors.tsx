import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';

type SensorData = {
  x: number;
  y: number;
  z: number;
};

// Los sensores de movimiento solo existen en un celular: en el navegador (web)
// expo-sensors no los soporta y la pantalla se rompería. Probar siempre en Expo Go.
export default function SensorsScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webNotice}>
        <Ionicons name="phone-portrait-outline" size={64} color="#45B7D1" />
        <Text style={styles.title}>Solo disponible en el celular</Text>
        <Text style={styles.subtitle}>Abrí la app con Expo Go para usar el acelerómetro y el giroscopio.</Text>
      </View>
    );
  }
  return <SensorsContent />;
}

function SensorsContent() {
  const [accelerometerData, setAccelerometerData] = useState<SensorData | null>(null);
  const [gyroscopeData, setGyroscopeData] = useState<SensorData | null>(null);
  const [isActive, setIsActive] = useState({
    accelerometer: false,
    gyroscope: false,
  });

  // LIMPIEZA OBLIGATORIA: Los sensores siguen enviando datos en segundo plano
  // si no se remueven los listeners. Esto agotaría la batería.
  useEffect(() => {
    return () => {
      // removeAllListeners: Detiene todas las suscripciones al desmontar la pantalla
      Accelerometer.removeAllListeners();
      Gyroscope.removeAllListeners();
    };
  }, []);

  const startAccelerometer = () => {
    if (isActive.accelerometer) {
      stopAccelerometer();
      return;
    }

    // setUpdateInterval: Define cada cuántos milisegundos queremos recibir datos.
    // Un valor muy bajo (ej: 10ms) puede saturar el bridge de React Native.
    Accelerometer.setUpdateInterval(100); 
    
    // addListener: Crea una suscripción que ejecuta el callback con cada movimiento.
    Accelerometer.addListener((data) => {
      setAccelerometerData(data);
    });
    setIsActive(prev => ({ ...prev, accelerometer: true }));
  };

  const stopAccelerometer = () => {
    Accelerometer.removeAllListeners();
    setAccelerometerData(null);
    setIsActive(prev => ({ ...prev, accelerometer: false }));
  };

  const startGyroscope = () => {
    if (isActive.gyroscope) {
      stopGyroscope();
      return;
    }

    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener((data) => {
      setGyroscopeData(data);
    });
    setIsActive(prev => ({ ...prev, gyroscope: true }));
  };

  const stopGyroscope = () => {
    Gyroscope.removeAllListeners();
    setGyroscopeData(null);
    setIsActive(prev => ({ ...prev, gyroscope: false }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sensores del Dispositivo</Text>
        <Text style={styles.subtitle}>
          Activa un sensor para ver sus datos en tiempo real
        </Text>
      </View>

      {/* Acelerómetro */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="phone-portrait" size={32} color="#FF6B6B" />
          <Text style={styles.cardTitle}>Acelerómetro</Text>
          {isActive.accelerometer && (
            <View style={styles.activeIndicator}>
              <View style={[styles.activeDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.activeText}>Activo</Text>
            </View>
          )}
        </View>
        <View style={styles.dataContainer}>
          {accelerometerData ? (
            <>
              <Text style={styles.dataText}>X: {accelerometerData.x.toFixed(2)}</Text>
              <Text style={styles.dataText}>Y: {accelerometerData.y.toFixed(2)}</Text>
              <Text style={styles.dataText}>Z: {accelerometerData.z.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.dataPlaceholder}>Presiona para iniciar</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isActive.accelerometer ? '#666' : '#FF6B6B' }]}
          onPress={startAccelerometer}
        >
          <Ionicons name={isActive.accelerometer ? 'stop' : 'play'} size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isActive.accelerometer ? 'Detener' : 'Iniciar'} Acelerómetro
          </Text>
        </TouchableOpacity>
      </View>

      {/* Giroscopio */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="sync" size={32} color="#4ECDC4" />
          <Text style={styles.cardTitle}>Giroscopio</Text>
          {isActive.gyroscope && (
            <View style={styles.activeIndicator}>
              <View style={[styles.activeDot, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.activeText}>Activo</Text>
            </View>
          )}
        </View>
        <View style={styles.dataContainer}>
          {gyroscopeData ? (
            <>
              <Text style={styles.dataText}>X: {gyroscopeData.x.toFixed(2)}</Text>
              <Text style={styles.dataText}>Y: {gyroscopeData.y.toFixed(2)}</Text>
              <Text style={styles.dataText}>Z: {gyroscopeData.z.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.dataPlaceholder}>Presiona para iniciar</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isActive.gyroscope ? '#666' : '#4ECDC4' }]}
          onPress={startGyroscope}
        >
          <Ionicons name={isActive.gyroscope ? 'stop' : 'play'} size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isActive.gyroscope ? 'Detener' : 'Iniciar'} Giroscopio
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#45B7D1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dataContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  dataPlaceholder: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
