import { Button, Card, Text } from "react-native-paper"
import ScreenWrapper from "../components/ScreenWrapper"
import { StyleSheet } from "react-native"
import sharedStyles from "../styles/sharedStyles"

export default function DetailsScreen({route, navigation}: any){
    // 'route.params' es donde guardamos los datos que pasamos desde la pantalla anterior.
    // Usamos '|| {}' para evitar errores si no se enviaron parámetros.
    const { item } = route.params || {}

    return (
        <ScreenWrapper title="Detalle del Item">
            {
                item ? (
                    <Card style={sharedStyles.card} >
                        <Card.Content>
                            <Text style={styles.itemTitle} > {item.title} </Text>
                            <Text variant="bodyMedium" > {item.description} </Text>
                            <Text style={styles.itemId} > Id del item: {item.id} </Text>
                        </Card.Content>
                    </Card>
                ) : (
                    <Text> No se recibío información del item </Text>
                )
            }

            <Button style={styles.button} mode="contained-tonal" onPress={() => navigation.goBack()}>
                Volver Atrás
            </Button>
        </ScreenWrapper>
    )
}


const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1d1b20'
  },
  itemId: {
    marginTop: 16,
    color: '#49454f'
  },
  button: {
    marginTop: 16,
  },
});