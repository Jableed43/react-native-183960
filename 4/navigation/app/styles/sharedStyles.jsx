import { StyleSheet } from 'react-native';

export const SPACING = 16;
export const RADIUS = 12;

const sharedStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: SPACING },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: SPACING, color: '#1d1b20' },
  card: {
    marginBottom: SPACING,
    borderRadius: RADIUS,
    elevation: 2,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: SPACING,
    right: 0,
    bottom: 0,
    backgroundColor: '#d0bcff'
  }
});

export default sharedStyles