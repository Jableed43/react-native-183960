import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import sharedStyles from '../styles/sharedStyles';

function ScreenWrapper({ children, title, withScroll = false }: any) {
    const Container = withScroll ? ScrollView : View;

    return (
    <SafeAreaView style={ sharedStyles.screen } edges={["bottom", "left", "right"]} >

        <Container style={ sharedStyles.content }>
        { title && <Text style={sharedStyles.title} > {title} </Text> }
        { children }
        </Container>

    </SafeAreaView>
  )
}

export default ScreenWrapper