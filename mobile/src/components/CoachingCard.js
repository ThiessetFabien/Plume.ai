import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Sparkles, X } from 'lucide-react-native';
import { Colors, Shadows } from '../theme/colors';

const CoachingCard = ({ message, isLoading, onClose }) => {
  if (isLoading) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator color={Colors.secondary} size="small" />
        <Text style={styles.loadingText}>Le coach Plume analyse tes performances...</Text>
      </View>
    );
  }

  if (!message) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View style={styles.iconCircle}>
            <Sparkles color={Colors.secondary} size={18} />
          </View>
          <Text style={styles.title}>Conseil Copilote</Text>
        </View>
        
        <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-button">
          <X color={Colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>
      <Text style={styles.body}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.secondary + '40', // Bordure subtile jaune
    marginVertical: 16,
    ...Shadows.medium,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderColor: Colors.primary + '30',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1, // Permet au texte de passer à la ligne s'il est trop long
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligne le titre à gauche et le X à droite
    marginBottom: 12,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  closeButton: {
    padding: 4,
  },
  iconCircle: {
    backgroundColor: Colors.secondary + '20',
    padding: 6,
    borderRadius: 50,
  },
  title: {
    color: Colors.secondary,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  body: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
});

export default CoachingCard;
