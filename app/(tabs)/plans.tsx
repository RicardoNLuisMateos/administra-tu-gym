import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { databaseOperations } from '../database/database';
import PlanModal from '../components/PlanModal';

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
  const [isEditing, setIsEditing] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    time: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

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
    setSelectedPlan(plan);
    setNewPlan({
      name: plan.name,
      price: plan.price.toString(),
      time: plan.time.toString()
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSavePlan = async () => {
    try {
      if (!newPlan.name.trim() || !newPlan.price || !newPlan.time) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      if (isEditing && selectedPlan) {
        // Aquí implementaremos la actualización del plan
        const result = await databaseOperations.plans.update(
          selectedPlan.id,
          newPlan.name,
          parseFloat(newPlan.price),
          parseInt(newPlan.time),
          1 // ID de la organización
        );

        if (result) {
          setModalVisible(false);
          setNewPlan({ name: '', price: '', time: '' });
          setIsEditing(false);
          setSelectedPlan(null);
          cargarPlanes();
          Alert.alert('Éxito', 'Plan actualizado correctamente');
        }
      } else {
        // Lógica existente para crear un nuevo plan
        const result = await databaseOperations.plans.create(
          newPlan.name,
          parseFloat(newPlan.price),
          parseInt(newPlan.time),
          1
        );

        if (result) {
          setModalVisible(false);
          setNewPlan({ name: '', price: '', time: '' });
          cargarPlanes();
          Alert.alert('Éxito', 'Plan creado correctamente');
        }
      }
    } catch (error) {
      console.error('Error al guardar el plan:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el plan');
    }
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
          onPress: async () => {
            try {
              const result = await databaseOperations.plans.delete(plan.id);
              if (result) {
                cargarPlanes(); // Recargar la lista de planes
                Alert.alert('Éxito', 'Plan eliminado correctamente');
              }
            } catch (error) {
              console.error('Error al eliminar el plan:', error);
              Alert.alert('Error', 'Ocurrió un error al eliminar el plan');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setIsEditing(false);
          setSelectedPlan(null);
          setNewPlan({ name: '', price: '', time: '' });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Nuevo Plan</Text>
      </TouchableOpacity>

      <PlanModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setIsEditing(false);
          setSelectedPlan(null);
          setNewPlan({ name: '', price: '', time: '' });
        }}
        onSave={handleSavePlan}
        plan={newPlan}
        setPlan={setNewPlan}
      />

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