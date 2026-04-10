import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import { Colors } from '../theme/colors';

const DURATION_OPTIONS = [
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
  { label: '2h30', value: 150 },
];

export default function AttendanceScreen() {
  const navigation = useNavigation();
  const [selectedDuration, setSelectedDuration] = useState(90);
  const [submitting, setSubmitting] = useState(false);
  const [date] = useState(new Date().toISOString().split('T')[0]); // Aujourd'hui par défaut

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Récupérer le premier joueur (Mock Auth)
      const playersRes = await api.get('/players/');
      if (playersRes.data.length === 0) throw new Error("Joueur non trouvé");
      const playerId = playersRes.data[0].id;

      const payload = {
        player_id: playerId,
        date: date,
        duration: selectedDuration
      };

      await api.post('/attendances/', payload);
      
      Toast.show({
        type: 'success',
        text1: 'Séance Enregistrée ! 🏸',
        text2: 'Bravo pour ton entraînement. Tes statistiques ont été mises à jour.',
      });
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: "Impossible d'enregistrer la séance.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Déclarer une séance</Text>
        <Text style={styles.subtitle}>Valide ton entraînement pour suivre ta progression.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <CalendarIcon color={Colors.primary} size={20} />
          <Text style={styles.label}>Date de la séance</Text>
        </View>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>Aujourd'hui, {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Clock color={Colors.primary} size={20} />
          <Text style={styles.label}>Durée de l'effort</Text>
        </View>
        
        <View style={styles.optionsGrid}>
          {DURATION_OPTIONS.map((opt) => (
            <TouchableOpacity 
              key={opt.value}
              style={[styles.option, selectedDuration === opt.value && styles.selectedOption]}
              onPress={() => setSelectedDuration(opt.value)}
            >
              <Text style={[styles.optionText, selectedDuration === opt.value && styles.selectedOptionText]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.submitBtn, submitting && styles.disabledBtn]} 
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <CheckCircle color="white" size={20} />
            <Text style={styles.submitBtnText}>Confirmer la séance</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  header: { marginBottom: 30, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 8 },
  card: { backgroundColor: Colors.surface, padding: 20, borderRadius: 24, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '700', color: Colors.text },
  dateDisplay: { backgroundColor: Colors.background, padding: 15, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  dateText: { color: Colors.text, fontWeight: '600' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: { flex: 1, minWidth: '45%', backgroundColor: Colors.background, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  selectedOption: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionText: { color: Colors.textSecondary, fontWeight: '700' },
  selectedOptionText: { color: 'white' },
  submitBtn: { backgroundColor: Colors.secondary, padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10 },
  submitBtnText: { color: Colors.background, fontWeight: '800', fontSize: 18 },
  disabledBtn: { opacity: 0.7 },
  cancelBtn: { padding: 20, alignItems: 'center' },
  cancelText: { color: Colors.textSecondary, fontWeight: '600' }
});
