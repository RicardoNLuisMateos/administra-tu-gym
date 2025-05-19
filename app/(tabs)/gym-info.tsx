import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { databaseOperations } from '../database/database';
import CustomModal from '../components/CustomModal';

export default function GymInfoScreen() {
  const [gymName, setGymName] = useState('Mi Gimnasio');
  const [gymPrice, setGymPrice] = useState(0);
  const [gymRecargoDays, setGymRecargoDays] = useState(0);
  const [gymMonto, setGymMonto] = useState(0);
  const [gymCancelacion, setGymCancelacion] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'success',
    message: ''
  });
  const router = useRouter();

  useEffect(() => {
    cargarNombreGimnasio();
  }, []);

  const cargarNombreGimnasio = async () => {
    try {
      const organizacion = await databaseOperations.organization.getAll();
      if (organizacion && organizacion.length > 0 && organizacion[0].name.trim()) {
        setGymName(organizacion[0].name);
      }
    } catch (error) {
      console.error('Error al cargar el nombre del gimnasio:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!gymName.trim()) {
        setModalConfig({
          type: 'error',
          message: 'Por favor ingresa el nombre del gimnasio'
        });
        setModalVisible(true);
        return;
      }

      const result = await databaseOperations.organization.update(1, gymName, gymPrice, gymRecargoDays, gymMonto, gymCancelacion);
      
      if (result) {
        setModalConfig({
          type: 'success',
          message: 'Nombre del gimnasio actualizado correctamente'
        });
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error al actualizar el nombre del gimnasio:', error);
      setModalConfig({
        type: 'error',
        message: 'Ocurrió un error al guardar los cambios'
      });
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Gimnasio</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre del Gimnasio</Text>
          <TextInput
            style={styles.input}
            value={gymName}
            onChangeText={setGymName}
            placeholder="Ingrese el nombre del gimnasio"
            placeholderTextColor="#888888"
          />
          <Text style={styles.inputLabel}>Precio de inscripción</Text>
          <TextInput
            style={styles.input}
            value={gymPrice}
            onChangeText={gymPrice => setGymPrice(gymPrice)}
            placeholder="Precio de inscripción"
            placeholderTextColor="#888888"
            keyboardType="numeric"
          />
          <Text style={styles.inputLabel}>Configuración de días de recargo</Text>
          <TextInput
            style={styles.input}
            value={gymRecargoDays}
            onChangeText={gymRecargoDays => setGymRecargoDays(gymRecargoDays)}
            placeholder="Número de días de recargo antes de la fecha de caducidad"
            placeholderTextColor="#888888"
            keyboardType="numeric"
          />
          <Text style={styles.inputLabel}>Monto de recargo</Text>
          <TextInput
            style={styles.input}
            value={gymMonto}
            onChangeText={gymMonto => setGymMonto(gymMonto)}
            placeholder="Monto de recargo de recargo"
            placeholderTextColor="#888888"
            keyboardType="numeric"
          />
          <Text style={styles.inputLabel}>Cancelación automatica</Text>
          <TextInput
            style={styles.input}
            value={gymCancelacion}
            onChangeText={gymCancelacion => setGymCancelacion(gymCancelacion)}
            placeholder="Días de cancelación después de la fecha de caducidad"
            placeholderTextColor="#888888"
            keyboardType="numeric"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={modalVisible}
        type={modalConfig.type as 'success' | 'error'}
        message={modalConfig.message}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});