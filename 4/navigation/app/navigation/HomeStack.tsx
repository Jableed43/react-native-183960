import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import DetailsScreen from '../screens/DetailsScreen'

const Stack = createNativeStackNavigator()

function HomeStack() {
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false,
        contentStyle: {
            backgroundColor: "#f5f5f5"
        }
    }}
    >
        <Stack.Screen
        name='Home'
        component={HomeScreen}
        />

         <Stack.Screen
        name='Details'
        component={DetailsScreen}
        />


    </Stack.Navigator>
  )
}

export default HomeStack