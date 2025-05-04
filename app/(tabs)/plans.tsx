import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { databaseOperations } from '../database/database';

interface Plan {
  id: number;
  name: string;
  price: number;
  time: number;
  organization_id: number;
}

export default function PlansScreen() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    time: ''
  });

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      const planesData = await databaseOperations.plans.getAll();
      setPlanes(planesData as Plan[]);
    } catch (error) {
      console.error('Error al cargar los planes:', error);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    // Implementar la lógica de edición
    Alert.alert('Editar Plan', `Editando el plan ${plan.name}`);
  };

  const handleDeletePlan = (plan: Plan) => {
    Alert.alert(
      'Eliminar Plan',
      `¿Estás seguro de que deseas eliminar el plan ${plan.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Implementar la lógica de eliminación
            Alert.alert('Plan Eliminado', `El plan ${plan.name} ha sido eliminado`);
          },
        },
      ]
    );
  };

  const handleAddPlan = async () => {
    try {
      if (!newPlan.name.trim() || !newPlan.price || !newPlan.time) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      const result = await databaseOperations.plans.create(
        newPlan.name,
        parseFloat(newPlan.price),
        parseInt(newPlan.time),
        1 // ID de la organización
      );

      if (result) {
        setModalVisible(false);
        setNewPlan({ name: '', price: '', time: '' });
        cargarPlanes(); // Recargar la lista de planes
        Alert.alert('Éxito', 'Plan creado correctamente');
      }
    } catch (error) {
      console.error('Error al crear el plan:', error);
      Alert.alert('Error', 'Ocurrió un error al crear el plan');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Nuevo Plan</Text>
      </TouchableOpacity>

      {/* Modal para agregar nuevo plan */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Plan</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre del plan"
                placeholderTextColor="#888888"
                value={newPlan.name}
                onChangeText={(text) => setNewPlan({...newPlan, name: text})}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Precio</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Precio"
                placeholderTextColor="#888888"
                keyboardType="numeric"
                value={newPlan.price}
                onChangeText={(text) => setNewPlan({...newPlan, price: text})}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Duración (Meses)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Duración en meses"
                placeholderTextColor="#888888"
                keyboardType="numeric"
                value={newPlan.time}
                onChangeText={(text) => setNewPlan({...newPlan, time: text})}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddPlan}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.plansContainer}>
        {planes.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>${plan.price}</Text>
              <Text style={styles.planDuration}>{plan.time} días</Text>
            </View>
            <View style={styles.planActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditPlan(plan)}
              >
                <Ionicons name="pencil" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeletePlan(plan)}
              >
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 14,
    color: '#888888',
  },
  planActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#442222',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#442222',
  },
  saveButton: {
    backgroundColor: '#224422',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});