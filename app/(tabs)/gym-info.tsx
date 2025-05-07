import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { databaseOperations } from '../database/database';

export default function GymInfoScreen() {
  const [gymName, setGymName] = useState('Mi Gimnasio');
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
    // Aquí implementaremos la lógica para guardar el nombre del gimnasio
    try {
      if (!gymName.trim()) {
        Alert.alert(
          'Error',
          'Por favor ingresa el nombre del gimnasio',
          [
            {
              text: 'OK',
              style: 'default'
            }
          ],
          {
            userInterfaceStyle: 'dark'
          }
        );
        return;
      }

      const result = await databaseOperations.organization.update(1, gymName);
      
      if (result) {
        Alert.alert(
          'Éxito',
          'Nombre del gimnasio actualizado correctamente',
          [
            {
              text: 'OK',
              style: 'default',
              //onPress: () => router.back()
            }
          ],
          {
            userInterfaceStyle: 'dark'
          }
        );
      }
    } catch (error) {
      console.error('Error al actualizar el nombre del gimnasio:', error);
      Alert.alert(
        'Error',
        'Ocurrió un error al guardar los cambios',
        [
          {
            text: 'OK',
            style: 'default'
          }
        ],
        {
          userInterfaceStyle: 'dark'
        }
      );
    }
    //router.back();
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
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
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