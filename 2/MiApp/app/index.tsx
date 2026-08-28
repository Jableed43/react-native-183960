import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [nombre, setNombre] = useState("Javier Lopez")
  const [bio, setBio] = useState("Aprendiendo react native")

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#5092de"}} >
      <ScrollView contentContainerStyle={styles.container} >
          <View style={styles.header} >
            <Image 
            source={{ uri: 'https://picsum.photos/200' }}
            style={styles.avatar}
            />
            <Text style={styles.nombre} > {nombre} </Text>
            <Text> {bio} </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}> Nombre: </Text>
            <TextInput
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            />
            <Text style={styles.label}>Biografía</Text>
            <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.boton} onPress={() => alert('¡Perfil actualizado!')} >
            <Text style={styles.botonTexto} > Actualizar perfil </Text>
          </TouchableOpacity>

          <Image
          source={require('../assets/images/loro.webp')}
          resizeMode="contain"
          style={styles.image}
          >

          </Image>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  nombre: { fontSize: 28, fontWeight: 'bold', marginTop: 10 },
  card: { width: '100%', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10 },
  label: { fontWeight: '600', marginBottom: 5, color: '#555' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 15 },
  boton: { backgroundColor: '#1900ff', padding: 15, borderRadius: 10, width: '100%', marginTop: 20 },
  botonTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  image: { width: 150, height: 150, marginTop: 40 },
})