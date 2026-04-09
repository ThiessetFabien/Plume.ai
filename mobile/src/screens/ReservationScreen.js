import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Calendar, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react-native';
import api from '../services/api';
import { Colors } from '../theme/colors';

const QUOTA_MAX = 20;

// Configuration des horaires autorisés par jour (0 = Dimanche, 1 = Lundi, etc.)
const AUTHORIZED_SCHEDULES = {
  1: ["17:00", "18:00", "19:00", "20:00", "21:00"], // Lundi
  4: ["19:00", "20:00", "21:00"],                   // Jeudi
  6: ["09:00", "10:00", "11:00"],                   // Samedi
};

export default function ReservationScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Générer les prochains jours et ne garder que ceux autorisés
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).filter(d => AUTHORIZED_SCHEDULES[d.getDay()]);

  // Initial sélection sur la première date valide
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].toISOString().split('T')[0]);
    }
  }, []);

  const fetchAvailability = async () => {
    if (!selectedDate) return;
    try {
      setLoading(true);
      const res = await api.get(`/reservations/day/${selectedDate}`);
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de charger les disponibilités.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate]);

  const handleReserve = async (slot) => {
    try {
      setSubmitting(true);
      const playersRes = await api.get('/players/');
      if (playersRes.data.length === 0) throw new Error("Joueur non trouvé");
      
      const payload = {
        player_id: playersRes.data[0].id,
        court_number: 0, // Mode Quota
        start_time: `${selectedDate}T${slot}:00`
      };

      await api.post('/reservations/', payload);
      Alert.alert("Succès", `Réservation confirmée pour ${slot} !`);
      fetchAvailability();
    } catch (err) {
      const detail = err.response?.data?.detail || "Le créneau est peut-être déjà complet ou vous avez dépassé votre limite hebdomadaire.";
      Alert.alert("Échec", detail);
    } finally {
      setSubmitting(false);
    }
  };

  const getSlotOccupancy = (slot) => {
    return reservations.filter(r => r.start_time.includes(slot)).length;
  };

  const currentDayOfWeek = selectedDate ? new Date(selectedDate).getDay() : null;
  const timeSlots = currentDayOfWeek !== null ? AUTHORIZED_SCHEDULES[currentDayOfWeek] || [] : [];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.row}>
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>1. Choisir le jour</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
          {dates.map(d => {
            const dateStr = d.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            return (
              <TouchableOpacity 
                key={dateStr} 
                style={[styles.dateItem, isSelected && styles.selectedItem]} 
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                  {d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={[styles.section, { flex: 1 }]}>
        <View style={styles.row}>
          <Clock size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>2. Créneaux disponibles</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.slotGrid}>
            {timeSlots.map(slot => {
              const count = getSlotOccupancy(slot);
              const isFull = count >= QUOTA_MAX;
              
              return (
                <TouchableOpacity 
                  key={slot} 
                  style={[styles.slotItem, isFull && styles.slotFull]} 
                  disabled={isFull || submitting}
                  onPress={() => handleReserve(slot)}
                >
                  <View style={styles.slotMain}>
                    <Text style={[styles.slotText, isFull && styles.slotTextFull]}>{slot}</Text>
                    <View style={styles.countBadge}>
                      <Users size={12} color={isFull ? Colors.textSecondary : Colors.primary} />
                      <Text style={[styles.countText, isFull && styles.slotTextFull]}>
                        {count} / {QUOTA_MAX}
                      </Text>
                    </View>
                  </View>
                  
                  {isFull ? (
                     <AlertCircle size={18} color={Colors.textSecondary} />
                  ) : (
                     <CheckCircle2 size={18} color={Colors.secondary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={styles.footerNote}>
        <AlertCircle size={14} color={Colors.textSecondary} />
        <Text style={styles.footerText}>Limite de 2 séances par semaine calendaire.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  section: { marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  dateList: { gap: 10 },
  dateItem: { backgroundColor: Colors.surface, padding: 15, borderRadius: 15, alignItems: 'center', minWidth: 90, borderWidth: 1, borderColor: 'transparent' },
  selectedItem: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  selectedText: { color: 'white', fontWeight: '700' },
  dateText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  slotItem: { width: '100%', backgroundColor: Colors.surface, padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderLeftWidth: 6, borderLeftColor: Colors.secondary },
  slotFull: { opacity: 0.5, borderLeftColor: Colors.textSecondary },
  slotMain: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  slotText: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  slotTextFull: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.background, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  countText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700' },
  footerNote: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 10 },
  footerText: { fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic' }
});
