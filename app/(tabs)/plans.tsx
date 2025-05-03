import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
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

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Agregar Nuevo Plan</Text>
      </TouchableOpacity>

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
});