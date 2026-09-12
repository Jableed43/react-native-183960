import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import HomeStack from './HomeStack'
import {Ionicons} from "@expo/vector-icons"
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={{
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "gray",
        headerShown: false
    }}
    >
        
        <Tab.Screen
        name='HomeTab'
        component={HomeStack}
        options={{
            title: "Inicio",
            tabBarLabel: "Inicio",
            tabBarIcon: ({color, size}) => (
                <Ionicons name='home' size={size} color={color} />
            )
        }}
        />

        <Tab.Screen
       name='ProfileTab'
       component={ProfileScreen}
       options={{
           title: "Perfil",
           tabBarLabel: "Perfil",
           tabBarIcon: ({color, size}) => (
               <Ionicons name='person' size={size} color={color} />
           )
       }}
       />

        
    </Tab.Navigator>
  )
}

export default TabNavigator