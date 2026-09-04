import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {


  return (
 <Tabs screenOptions={{headerShown: true}}>
  <Tabs.Screen
  name="index"
  options={{title: "Tareas", tabBarIcon: () => <Text> 📖 </Text> }}
  />

 </Tabs>
  )
}
