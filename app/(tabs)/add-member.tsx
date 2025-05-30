import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Switch, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import { databaseOperations } from '../database/database';
import { useRouter } from 'expo-router';
import CustomModal from '../components/CustomModal';

interface Plan {
  id: number;
  name: string;
  price: number;
  time: number;
  organization_id: number;
}

export default function AddMember() {
  
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('');
  const [deuda, setDeuda] = useState('0');
  const [suscriptionActive, setSuscriptionActive] = useState(false);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'success' as 'success' | 'error',
    message: ''
  });

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        const planesData = await databaseOperations.plans.getAll();
        setPlanes(planesData as Plan[]);
      } catch (error) {
        console.error('Error al cargar los planes:', error);
      }
    };

    cargarPlanes();
  }, []);

  const historialPagos = [
    { fecha: '01/01/2024', monto: 500 },
    { fecha: '01/02/2024', monto: 500 },
    { fecha: '01/03/2024', monto: 500 },
  ];

  // Función para limpiar todos los campos
  const resetFields = () => {
    setNombre('');
    setPlan('');
    setDeuda('0');
    setSuscriptionActive(false);
  };

  // Limpiar campos cuando el componente se monta
  useEffect(() => {
    resetFields();
  }, []);

  const handleSaveMember = async () => {
    try {
      // Validaciones básicas
      if (!nombre.trim()) {
        setModalConfig({
          type: 'error',
          message: 'Por favor ingresa el nombre del miembro'
        });
        setModalVisible(true);
        return;
      }

      if (!plan) {
        setModalConfig({
          type: 'error',
          message: 'Por favor selecciona un plan'
        });
        setModalVisible(true);
        return;
      }
      console.log("databaseOperations => ", databaseOperations)
      // Crear el miembro
      const memberResult = await databaseOperations.member.create(nombre, 1); // 1 es el ID de la organización

      if (memberResult && memberResult.lastInsertRowId) {
        // Crear la suscripción
        const member = await databaseOperations.subscriptions.create({
          member_id: memberResult.lastInsertRowId,
          plan_id: parseInt(plan),
          start_date: new Date().toISOString().split('T')[0],
        });
        console.log("member => ", member)
        if (!member) {
          setModalConfig({
            type: 'error',
            message: 'Ocurrió un error al crear la suscripción'
          });
          setModalVisible(true);
          return;
        }

        setModalConfig({
          type: 'success',
          message: 'Miembro agregado correctamente'
        });
        setModalVisible(true);
        // Limpiar campos antes de navegar
        resetFields();
        setTimeout(() => {
          router.push('/members');
        }, 1500);
      }
    } catch (error) {
      console.error('Error al guardar el miembro:', error);
      setModalConfig({
        type: 'error',
        message: 'Ocurrió un error al guardar el miembro'
      });
      setModalVisible(true);
    }
  };

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
              mode="dropdown"
            >
              {planes.map((plan) => (
                <Picker.Item 
                  key={plan.id}
                  label={`${plan.name} - $${plan.price}`}
                  value={plan.id.toString()}
                  color="#FFFFFF"
                  style={{backgroundColor: '#333333'}}
                />
              ))}
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
              value={suscriptionActive}
              onValueChange={setSuscriptionActive}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={suscriptionActive ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveMember}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
        <CustomModal
          visible={modalVisible}
          type={modalConfig.type}
          message={modalConfig.message}
          onClose={() => setModalVisible(false)}
        />
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
    overflow: 'hidden'
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
    backgroundColor: '#333333'
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