import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { CircleSlash, Trash2, X } from 'lucide-react-native';
import { Colors } from '../theme/colors';

/**
 * BulkCancelModal - Permet de choisir entre supprimer un créneau ou toute la journée
 */
export const BulkCancelModal = ({ 
  visible, 
  onCancelSingle, 
  onCancelAll, 
  onDismiss 
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <CircleSlash size={28} color={Colors.error} />
            </View>
            <Text style={styles.title}>Se désinscrire ?</Text>
            <Text style={styles.subtitle}>
              Tu as plusieurs réservations aujourd'hui. Que souhaites-tu annuler ?
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Option 1: Un seul créneau */}
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={onCancelSingle}
            >
              <View style={styles.optionLeading}>
                <View style={[styles.miniIcon, { backgroundColor: Colors.surface }]}>
                  <X size={16} color={Colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Juste ce créneau</Text>
                  <Text style={styles.optionDesc}>Libère uniquement cette heure</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Option 2: Toute la journée */}
            <TouchableOpacity 
              style={[styles.optionItem, styles.optionPrimary]}
              onPress={onCancelAll}
            >
              <View style={styles.optionLeading}>
                <View style={[styles.miniIcon, { backgroundColor: 'white' }]}>
                  <Trash2 size={16} color={Colors.error} />
                </View>
                <View>
                  <Text style={[styles.optionLabel, { color: 'white' }]}>Toute la journée</Text>
                  <Text style={[styles.optionDesc, { color: 'rgba(255,255,255,0.7)' }]}>Annule toutes tes présences aujourd'hui</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Cancel */}
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissText}>Garder mes inscriptions</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionPrimary: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  optionLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  miniIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dismissButton: {
    padding: 12,
    alignItems: 'center',
  },
  dismissText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
});
