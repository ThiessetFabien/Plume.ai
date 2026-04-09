import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react-native';
import api from '../services/api';
import { Colors } from '../theme/colors';

const COURTS = [1, 2, 3, 4, 5];
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
  "20:00", "21:00"
];

export default function ReservationScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourt, setSelectedCourt] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Générer les 7 prochains jours
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const fetchAvailability = async () => {
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
        court_number: selectedCourt,
        start_time: `${selectedDate}T${slot}:00`,
        end_time: `${selectedDate}T${slot.replace(/(\d+):/, (m, p) => (parseInt(p)+1).toString().padStart(2, '0') + ':')}:00`
      };

      await api.post('/reservations/', payload);
      Alert.alert("Succès", `Terrain ${selectedCourt} réservé à ${slot} !`);
      fetchAvailability();
    } catch (err) {
      const detail = err.response?.data?.detail || "Le terrain est peut-être déjà occupé.";
      Alert.alert("Échec", detail);
    } finally {
      setSubmitting(false);
    }
  };

  const isSlotTaken = (slot) => {
    return reservations.some(r => 
      r.court_number === selectedCourt && 
      r.start_time.includes(slot)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Choisir la date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
          {dates.map(date => (
            <TouchableOpacity 
              key={date} 
              style={[styles.dateItem, selectedDate === date && styles.selectedItem]} 
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateText, selectedDate === date && styles.selectedText]}>
                {new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Choisir le terrain</Text>
        <View style={styles.courtList}>
          {COURTS.map(court => (
            <TouchableOpacity 
              key={court} 
              style={[styles.courtItem, selectedCourt === court && styles.selectedCourt]} 
              onPress={() => setSelectedCourt(court)}
            >
              <MapPin size={16} color={selectedCourt === court ? 'white' : Colors.textSecondary} />
              <Text style={[styles.courtText, selectedCourt === court && styles.selectedText]}>T{court}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { flex: 1 }]}>
        <Text style={styles.sectionTitle}>3. Créneaux disponibles</Text>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.slotGrid}>
            {TIME_SLOTS.map(slot => {
              const taken = isSlotTaken(slot);
              return (
                <TouchableOpacity 
                  key={slot} 
                  style={[styles.slotItem, taken && styles.slotTaken]} 
                  disabled={taken || submitting}
                  onPress={() => handleReserve(slot)}
                >
                  <Clock size={14} color={taken ? Colors.textSecondary : Colors.primary} />
                  <Text style={[styles.slotText, taken && styles.slotTextTaken]}>{slot}</Text>
                  {taken ? (
                     <Text style={styles.statusOccupied}>Occupé</Text>
                  ) : (
                     <CheckCircle2 size={16} color={Colors.secondary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  dateList: { gap: 10 },
  dateItem: { backgroundColor: Colors.surface, padding: 12, borderRadius: 12, alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: 'transparent' },
  selectedItem: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  selectedText: { color: 'white', fontWeight: '700' },
  dateText: { color: Colors.textSecondary, fontSize: 14 },
  courtList: { flexDirection: 'row', gap: 10 },
  courtItem: { flex: 1, backgroundColor: Colors.surface, padding: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  selectedCourt: { backgroundColor: Colors.secondary },
  courtText: { color: Colors.textSecondary, fontWeight: '600' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  slotItem: { width: '48%', backgroundColor: Colors.surface, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderLeftWidth: 4, borderLeftColor: Colors.secondary },
  slotTaken: { opacity: 0.6, borderLeftColor: Colors.textSecondary },
  slotText: { color: Colors.text, fontWeight: '600', flex: 1 },
  slotTextTaken: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  statusOccupied: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700' }
});
