import React, { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper'
import sharedStyles from '../styles/sharedStyles';
import ScreenWrapper from '../components/ScreenWrapper';

interface Item {
    id: number;
    title: string;
    description: string;
}

export default function HomeScreen({ navigation }: any) {

    const [items] = useState<Item[]>([
        { id: 1, title: "Item 1", description: "Descripción del item 1" },
        { id: 2, title: "Item 2", description: "Descripción del item 2" },
        { id: 3, title: "Item 3", description: "Descripción del item 3" },
    ])

    const renderItem = ({item} : {item: Item}) => (
        <Card style={sharedStyles.card} onPress={() => navigation.navigate("Details", {item})} >
            <Card.Content>
                <Text style={styles.itemTitle} > {item.title} </Text>
                <Text variant='bodyMedium'>  {item.description} </Text>
            </Card.Content>
        </Card>
    )

  return (
    <ScreenWrapper title="Lista de items">
        <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        /> 
        
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#1d1b20'
  }
});
