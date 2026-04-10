import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Colors } from '../theme/colors';

/**
 * CustomConfirmationModal - Une modale premium pour valider les actions critiques.
 */
export const CustomConfirmationModal = ({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirmer", 
  cancelText = "Annuler" 
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.modalContent}>
          {/* Icône d'avertissement */}
          <View style={styles.iconContainer}>
            <AlertTriangle size={32} color={Colors.error} />
          </View>

          {/* Textes */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 15,
  },
  confirmButton: {
    flex: 1.5,
    backgroundColor: Colors.error,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 15,
  },
});
