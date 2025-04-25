import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

export default function AddMember() {
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('basico');
  const [deuda, setDeuda] = useState('0');
  const [tieneDeuda, setTieneDeuda] = useState(false);

  const historialPagos = [
    { fecha: '01/01/2024', monto: 500 },
    { fecha: '01/02/2024', monto: 500 },
    { fecha: '01/03/2024', monto: 500 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#888888"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={plan}
              onValueChange={(itemValue) => setPlan(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Básico" value="basico" color="#FFFFFF" />
              <Picker.Item label="Premium" value="premium" color="#FFFFFF" />
              <Picker.Item label="VIP" value="vip" color="#FFFFFF" />
            </Picker>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de pagos</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.fechaColumn]}>Fecha</Text>
            <Text style={[styles.tableHeaderText, styles.montoColumn]}>Monto</Text>
          </View>
          {historialPagos.map((pago, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.fechaColumn]}>{pago.fecha}</Text>
              <Text style={[styles.tableCell, styles.montoColumn]}>${pago.monto}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deuda</Text>
          <View style={styles.deudaContainer}>
            <TextInput
              style={[styles.input, styles.deudaInput]}
              placeholder="$0"
              placeholderTextColor="#888888"
              value={deuda}
              onChangeText={setDeuda}
              keyboardType="numeric"
            />
            <Switch
              value={tieneDeuda}
              onValueChange={setTieneDeuda}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={tieneDeuda ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#333333',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
  },
  picker: {
    color: '#FFFFFF',
    height: 45,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tableHeaderText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tableCell: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  fechaColumn: {
    flex: 1,
  },
  montoColumn: {
    flex: 1,
  },
  deudaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deudaInput: {
    flex: 1,
    marginRight: 16,
  },
  saveButton: {
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});