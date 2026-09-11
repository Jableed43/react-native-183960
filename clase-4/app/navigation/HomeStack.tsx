import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";

// createNativeStackNavigator: Crea un navegador tipo "pila" (stack).
// Las pantallas se ponen una encima de otra al navegar.
const Stack = createNativeStackNavigator()

/**
 * HomeStack: Navegador de tipo pila para la sección de Inicio.
 * Permite moverse de la lista (Home) al detalle (Details).
 */
export default function HomeStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            // headerShown: false para evitar que se vea el header predeterminado
            // si ya tenemos un componente propio que haga de header.
            headerShown: false, 
            contentStyle:{
                backgroundColor: '#f5f5f5',
            }
        }}
        >
            {/* 
                Al registrar 'HomeScreen' y 'DetailsScreen', ambas funciones
                recibirán { navigation, route } de regalo por parte de 'Stack.Navigator'.
            */}

            {/* Pantalla inicial de la lista */}
            <Stack.Screen
            name="Home"
            component={HomeScreen}
            />

            {/* Pantalla para ver detalles de un item específico */}
            <Stack.Screen
            name="Details"
            component={DetailsScreen}
            />

        </Stack.Navigator>
    )
}