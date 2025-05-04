import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

interface PlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  plan: {
    name: string;
    price: string;
    time: string;
  };
  setPlan: (plan: { name: string; price: string; time: string; }) => void;
}

export default function PlanModal({ visible, onClose, onSave, plan, setPlan }: PlanModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
              value={plan.name}
              onChangeText={(text) => setPlan({...plan, name: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Precio</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Precio"
              placeholderTextColor="#888888"
              keyboardType="numeric"
              value={plan.price}
              onChangeText={(text) => setPlan({...plan, price: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Duración (Meses)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Duración en meses"
              placeholderTextColor="#888888"
              keyboardType="numeric"
              value={plan.time}
              onChangeText={(text) => setPlan({...plan, time: text})}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.modalButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
  },
  modalInput: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#444444',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
});