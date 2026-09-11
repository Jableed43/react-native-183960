import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sharedStyles } from "../styles/sharedStyles";
import { Text } from 'react-native-paper'

interface ScreenWrapperProps {
    children: React.ReactNode;
    title?: string;
    withScroll?: boolean;
}

/**
 * ScreenWrapper: Un componente de alto nivel que envuelve todas nuestras pantallas.
 * 
 * Finalidad:
 * - Unifica la estructura visual de todas las pantallas.
 * - Maneja el SafeAreaView para que el contenido no se choque con los bordes físicos (como el notch).
 * - Centraliza el padding y el fondo usando estilos compartidos.
 * - Permite elegir si la pantalla debe tener scroll o no.
 */

export default function ScreenWrapper({ children, title, withScroll = false }: ScreenWrapperProps){
    const Container = withScroll ? ScrollView : View;

    return (
        /* SafeAreaView: Evita que el contenido quede debajo de elementos físicos del teléfono.
           edges: Definimos que solo proteja los bordes laterales e inferior para no chocar con el StatusBar de arriba. */
        <SafeAreaView style={sharedStyles.screen}
        edges={['bottom', 'left', 'right']} >
            {/* Si 'withScroll' es true, usamos ScrollView. Si es false, un View normal. */}
            <Container style={sharedStyles.content}>
                { title && (
                  <Text style={sharedStyles.title}>
                    {title}
                  </Text>  
                ) }
                { children }
            </Container>
        </SafeAreaView>
    )
}