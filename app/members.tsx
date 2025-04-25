import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';

// Sample data - replace with your actual data source later
const sampleMembers = [
  { id: '1', name: 'Juan Pérez', membership: 'Premium', status: 'Active' },
  { id: '2', name: 'María García', membership: 'Standard', status: 'Active' },
  { id: '3', name: 'Carlos López', membership: 'Basic', status: 'Inactive' },
  { id: '4', name: 'Ana Martínez', membership: 'Premium', status: 'Active' },
];

export default function MembersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Miembros del Gimnasio</Text>
      <FlatList
        data={sampleMembers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>{item.name}</Text>
            <View style={styles.memberDetails}>
              <Text style={styles.membershipText}>Membresía: {item.membership}</Text>
              <Text style={{ 
                color: item.status === 'Active' ? '#4CAF50' : '#F44336',
                fontWeight: '500',
                color: item.status === 'Active' ? '#4CAF50' : '#F44336' 
              }}>
                Estado: {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Dark background matching the tab bar in the image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF', // White text for dark background
  },
  listContent: {
    paddingBottom: 20,
  },
  memberCard: {
    backgroundColor: '#1E1E1E', // Darker card background
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#333333', // Subtle border
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF', // White text
  },
  memberDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  membershipText: {
    color: '#CCCCCC', // Light gray text
  }
});