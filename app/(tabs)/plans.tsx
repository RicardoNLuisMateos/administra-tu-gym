import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { databaseOperations } from '../database/database';
import PlanModal from '../components/PlanModal';
import CustomModal from '../components/CustomModal';

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
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customModalConfig, setCustomModalConfig] = useState({
    type: 'success' as 'success' | 'error',
    message: ''
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
        setSelectedPlan(null); // Aseguramos que no hay plan seleccionado
        setCustomModalConfig({
          type: 'error',
          message: 'Por favor completa todos los campos'
        });
        setCustomModalVisible(true);
        return;
      }

      if (isEditing && selectedPlan) {
        const result = await databaseOperations.plans.update(
          selectedPlan.id,
          newPlan.name,
          parseFloat(newPlan.price),
          parseInt(newPlan.time),
          1
        );

        if (result) {
          setModalVisible(false);
          setNewPlan({ name: '', price: '', time: '' });
          setIsEditing(false);
          setSelectedPlan(null);
          cargarPlanes();
          setCustomModalConfig({
            type: 'success',
            message: 'Plan actualizado correctamente'
          });
          setCustomModalVisible(true);
        }
      } else {
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
          setCustomModalConfig({
            type: 'success',
            message: 'Plan creado correctamente'
          });
          setCustomModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error al guardar el plan:', error);
      setSelectedPlan(null); // Aseguramos que no hay plan seleccionado
      setCustomModalConfig({
        type: 'error',
        message: 'Ocurrió un error al guardar el plan'
      });
      setCustomModalVisible(true);
    }
  };

  const handleDeletePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setCustomModalConfig({
      type: 'error',
      message: `¿Estás seguro de que deseas eliminar el plan ${plan.name}?`
    });
    setCustomModalVisible(true);
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
              <Text style={styles.planDuration}>{plan.time} Mes</Text>
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
      <CustomModal
        visible={customModalVisible}
        type={customModalConfig.type}
        message={customModalConfig.message}
        onClose={() => setCustomModalVisible(false)}
        showConfirmButton={!!selectedPlan}
        onConfirm={async () => {
          if (selectedPlan) {
            try {
              const result = await databaseOperations.plans.delete(selectedPlan.id);
              if (result) {
                cargarPlanes();
                setCustomModalConfig({
                  type: 'success',
                  message: 'Plan eliminado correctamente'
                });
              }
            } catch (error) {
              console.error('Error al eliminar el plan:', error);
              setCustomModalConfig({
                type: 'error',
                message: 'Ocurrió un error al eliminar el plan'
              });
            }
            setSelectedPlan(null);
          }
        }}
      />
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