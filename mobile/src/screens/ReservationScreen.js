import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { Calendar, Users, Clock, CheckCircle2, AlertCircle, WifiOff } from 'lucide-react-native';
import api from '../services/api';
import { Colors } from '../theme/colors';

const QUOTA_MAX = 20;

// Horaires autorisés par jour de la semaine (getDay() : 0=dim, 1=lun, 4=jeu, 6=sam)
const AUTHORIZED_SCHEDULES = {
  1: ["17:00", "18:00", "19:00", "20:00", "21:00"], // Lundi
  4: ["19:00", "20:00", "21:00"],                   // Jeudi
  6: ["09:00", "10:00", "11:00"],                   // Samedi
};

/**
 * Formate une Date en chaîne locale YYYY-MM-DD sans conversion UTC.
 * Évite le bug de décalage d'un jour en UTC+2.
 */
const toLocalDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * Retourne le numéro de jour de la semaine à partir d'un string "YYYY-MM-DD"
 * en interprétant la date en heure locale (pas UTC).
 */
const getDayOfWeek = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
};

const DAY_LABELS = { 1: 'Lundi', 4: 'Jeudi', 6: 'Samedi' };

export default function ReservationScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Générer les 21 prochains jours et ne garder que Lun/Jeu/Sam
  const dates = Array.from({ length: 21 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  })
    .filter(d => AUTHORIZED_SCHEDULES[d.getDay()])
    .map(d => toLocalDateStr(d));

  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  const fetchAvailability = async () => {
    if (!selectedDate) return;
    try {
      setLoading(true);
      setApiError(false);
      const res = await api.get(`/reservations/day/${selectedDate}`);
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('fetchAvailability error:', err);
      setApiError(true);
      Alert.alert("Connexion", "Impossible de charger les disponibilités. Vérifiez votre réseau.");
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
      if (!playersRes.data?.length) throw new Error("Joueur non trouvé");

      const payload = {
        player_id: playersRes.data[0].id,
        court_number: 0,
        start_time: `${selectedDate}T${slot}:00`,
      };

      await api.post('/reservations/', payload);
      Alert.alert("Séance réservée ! 🏸", `Créneau du ${selectedDate} à ${slot} confirmé.`);
      fetchAvailability();
    } catch (err) {
      const detail = err.response?.data?.detail
        || (err.response?.status === 422 ? "Données invalides." : null)
        || "Créneau complet ou limite hebdomadaire atteinte.";
      Alert.alert("Réservation impossible", detail);
    } finally {
      setSubmitting(false);
    }
  };

  const getSlotOccupancy = (slot) =>
    reservations.filter(r => r.start_time && r.start_time.includes(`T${slot}`)).length;

  const dayOfWeek = selectedDate ? getDayOfWeek(selectedDate) : null;
  const timeSlots = dayOfWeek !== null ? AUTHORIZED_SCHEDULES[dayOfWeek] ?? [] : [];

  return (
    <View style={styles.container}>

      {/* Sélecteur de jour */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Calendar size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Choisir le jour</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
          {dates.map(dateStr => {
            const dow = getDayOfWeek(dateStr);
            const dayParts = dateStr.split('-');
            const dayNum = parseInt(dayParts[2], 10);
            const monthNum = parseInt(dayParts[1], 10);
            const isSelected = selectedDate === dateStr;
            return (
              <TouchableOpacity
                key={dateStr}
                style={[styles.dateItem, isSelected && styles.selectedItem]}
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[styles.dateLabel, isSelected && styles.selectedText]}>
                  {DAY_LABELS[dow]}
                </Text>
                <Text style={[styles.dateNum, isSelected && styles.selectedText]}>
                  {dayNum}/{monthNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Créneaux */}
      <View style={[styles.section, { flex: 1 }]}>
        <View style={styles.row}>
          <Clock size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Créneaux disponibles</Text>
          {apiError && <WifiOff size={16} color="#ef4444" style={{ marginLeft: 'auto' }} />}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.slotList}>
            {timeSlots.length === 0 ? (
              <Text style={styles.emptyText}>Aucun créneau ce jour.</Text>
            ) : (
              timeSlots.map(slot => {
                const count = getSlotOccupancy(slot);
                const remaining = QUOTA_MAX - count;
                const isFull = remaining <= 0;
                const isLowStock = remaining <= 5 && !isFull;

                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotItem,
                      isFull && styles.slotFull,
                      isLowStock && styles.slotLow,
                    ]}
                    disabled={isFull || Boolean(submitting)}
                    onPress={() => handleReserve(slot)}
                    activeOpacity={0.75}
                  >
                    {/* Heure */}
                    <View style={styles.slotHour}>
                      <Clock size={14} color={isFull ? Colors.textSecondary : Colors.primary} />
                      <Text style={[styles.slotTimeText, isFull && styles.disabledText]}>
                        {slot}
                      </Text>
                    </View>

                    {/* Compteur de places */}
                    <View style={[styles.quota, isFull && styles.quotaFull]}>
                      <Users size={13} color={isFull ? Colors.textSecondary : Colors.primary} />
                      <Text style={[styles.quotaText, isFull && styles.disabledText]}>
                        {remaining} / {QUOTA_MAX}
                      </Text>
                    </View>

                    {/* Statut */}
                    {isFull
                      ? <Text style={styles.tagFull}>Complet</Text>
                      : isLowStock
                        ? <Text style={styles.tagLow}>Dernières places</Text>
                        : <CheckCircle2 size={18} color={Colors.secondary} />
                    }
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}
      </View>

      {/* Note réglementaire */}
      <View style={styles.footerNote}>
        <AlertCircle size={13} color={Colors.textSecondary} />
        <Text style={styles.footerText}>
          Limite de 2 séances par semaine calendaire · {QUOTA_MAX} places/créneau
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  section: { marginBottom: 22 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },

  // Sélecteur de dates
  dateList: { gap: 10, paddingBottom: 4 },
  dateItem: {
    backgroundColor: Colors.surface, paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 16, alignItems: 'center', minWidth: 80,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  selectedItem: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  dateNum: { fontSize: 18, fontWeight: '800', color: Colors.text, marginTop: 2 },
  selectedText: { color: 'white' },

  // Créneaux
  slotList: { gap: 12, paddingBottom: 10 },
  slotItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, padding: 18, borderRadius: 20,
    borderLeftWidth: 5, borderLeftColor: Colors.secondary,
  },
  slotFull: { opacity: 0.5, borderLeftColor: Colors.textSecondary },
  slotLow: { borderLeftColor: '#f59e0b' },

  slotHour: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  slotTimeText: { fontSize: 20, fontWeight: '800', color: Colors.text },
  disabledText: { color: Colors.textSecondary, textDecorationLine: 'line-through' },

  quota: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primary + '20',
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10,
  },
  quotaFull: { backgroundColor: Colors.textSecondary + '15' },
  quotaText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  tagFull: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    backgroundColor: Colors.textSecondary + '20',
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6,
  },
  tagLow: {
    fontSize: 11, fontWeight: '700', color: '#f59e0b',
    backgroundColor: '#f59e0b20',
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6,
  },

  emptyText: { color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: 30 },

  footerNote: { flexDirection: 'row', alignItems: 'center', gap: 7, justifyContent: 'center', marginTop: 6, marginBottom: 10 },
  footerText: { fontSize: 11, color: Colors.textSecondary, fontStyle: 'italic' },
});
