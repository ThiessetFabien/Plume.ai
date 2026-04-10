import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { RefreshCcw, X, Calendar } from 'lucide-react-native';
import { Colors } from '../theme/colors';

/**
 * ConflictResolutionModal - Permet d'échanger un jour réservé contre un autre
 */
export const ConflictResolutionModal = ({ 
  visible, 
  reservedDays = [], // Liste de dates "YYYY-MM-DD"
  onResolve, 
  onCancel 
}) => {
  
  // Helper pour formater l'affichage (ex: Lundi 13/04)
  const formatDay = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(y, m - 1, d);
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${d}/${m}`;
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <RefreshCcw size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.title}>Quota atteint</Text>
            <Text style={styles.subtitle}>
              Tu es déjà inscrit sur 2 journées cette semaine. Pour réserver ce créneau, tu dois libérer l'une de tes journées existantes :
            </Text>
          </View>

          {/* Liste des jours en conflit */}
          <View style={styles.daysList}>
            {reservedDays.map((day) => (
              <TouchableOpacity 
                key={day}
                style={styles.dayItem}
                onPress={() => onResolve(day)}
              >
                <View style={styles.dayInfo}>
                  <Calendar size={18} color={Colors.primary} />
                  <Text style={styles.dayText}>{formatDay(day)}</Text>
                </View>
                <View style={styles.actionBadge}>
                  <Text style={styles.actionText}>Remplacer</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Text style={styles.closeText}>Finalement, non</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)', // Dark overlay
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary + '15',
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
  daysList: {
    gap: 12,
    marginBottom: 24,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  actionBadge: {
    backgroundColor: Colors.primary + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
  },
  closeText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
