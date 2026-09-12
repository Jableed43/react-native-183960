import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import ScreenWrapper from '../components/ScreenWrapper';
import sharedStyles from '../styles/sharedStyles';

export default function ProfileScreen() {
  return (
    <ScreenWrapper title="Mi Perfil">
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" />
        <Text variant="headlineSmall" style={styles.name}>Javier Lopez</Text>
      </View>

      <Card style={sharedStyles.card}>
        <Card.Content>
          <Text style={styles.text}>Email: jlopez@gmail.com</Text>
          <Text style={styles.text}>Rol: Docente React Native</Text>
        </Card.Content>
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 8,
    color: '#49454f'
  }
});
