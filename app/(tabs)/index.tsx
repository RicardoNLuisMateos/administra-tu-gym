import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

// Datos de ejemplo - reemplazar con datos reales más tarde
const proximosPagos = [
  { id: '1', miembro: 'Juan Juarez', monto: 1000, fecha: '04/08' },
  { id: '2', miembro: 'Adolfo Martinez', monto: 450, fecha: '05/07' },
  { id: '3', miembro: 'Karla Montez', monto: 1406, fecha: '10/12' },
  { id: '4', miembro: 'Mariana Valdez', monto: 897, fecha: '01/11' },
];

export default function Index() {
  const [selectedMonth, setSelectedMonth] = useState('1');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Enero" value="1" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Febrero" value="2" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Marzo" value="3" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Abril" value="4" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Mayo" value="5" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Junio" value="6" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Julio" value="7" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Agosto" value="8" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Septiembre" value="9" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Octubre" value="10" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Noviembre" value="11" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
              <Picker.Item label="Diciembre" value="12" color="#FFFFFF" style={{backgroundColor: '#333333'}} />
            </Picker>
          </View>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pagar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ingresos</Text>
            <Text style={styles.statValue}>$8750</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Egresos</Text>
            <Text style={styles.statValue}>$3200</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Balance</Text>
            <Text style={styles.statValue}>$5550</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Agregar Miembro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Egresos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentsSection}>
          <Text style={styles.sectionTitle}>Próximos Pagos</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.memberColumn]}>Miembro</Text>
            <Text style={[styles.tableHeaderText, styles.amountColumn]}>$</Text>
            <Text style={[styles.tableHeaderText, styles.dateColumn]}>Fecha</Text>
          </View>
          {proximosPagos.map((pago) => (
            <View key={pago.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.memberColumn]}>{pago.miembro}</Text>
              <Text style={[styles.tableCell, styles.amountColumn]}>{pago.monto}</Text>
              <Text style={[styles.tableCell, styles.dateColumn]}>{pago.fecha}</Text>
            </View>
          ))}
        </View>
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
    paddingBottom: 32, // Añade más espacio al final para mejor scroll
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 16,
    backgroundColor: '#333333',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
  },
  picker: {
    color: '#FFFFFF',
    height: 45,
    backgroundColor: '#333333',
  },
  pickerItem: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#333333', // Actualizado para coincidir con los botones de acción
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    height: 45, // Altura fija para coincidir con el picker
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statItem: {
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
  paymentsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
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
  memberColumn: {
    flex: 2,
  },
  amountColumn: {
    flex: 1,
  },
  dateColumn: {
    flex: 1,
  },
});
