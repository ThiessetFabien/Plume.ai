import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Target as TargetIcon, Calendar as CalendarIcon, Sparkles as SparkleIcon, Clock as ClockIcon, MapPin, AlertTriangle, LogOut, BarChart3 } from 'lucide-react-native';
import api from '../services/api';
import { Colors } from '../theme/colors';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import CoachingCard from '../components/CoachingCard';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const COACH_TIPS = [
  "Une régularité de 2 séances par semaine augmente votre progression de 40%.",
  "Le smash est le coup le plus rapide ! Travaillez votre rotation d'épaule.",
  "Hydratation : buvez au moins 500ml d'eau par heure de jeu intense. Prenez soin de vous !",
  "Le repos fait partie de l'entraînement. Ménagez vos jours de récupération pour revenir plus fort.",
  "Le jeu de jambes (footwork) économise 30% de votre énergie sur le terrain. Travaillez-le tout en douceur.",
  "Chaque séance compte, quel que soit le résultat. L'important est le plaisir de jouer !",
  "Plume.ai analyse vos tendances : la constance bienveillante bat l'intensité ponctuelle."
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { signOut, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [coachingMessage, setCoachingMessage] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [currentTip, setCurrentTip] = useState(COACH_TIPS[0]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const playersRes = await api.get('/players/me');
      if (playersRes.data && playersRes.data.id) {
        const statsRes = await api.get(`/players/stats`);
        setStats({ ...statsRes.data, full_name: playersRes.data.full_name, id: playersRes.data.id });
      } else {
        throw new Error("Aucun joueur trouvé.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Sélectionne un conseil aléatoire
      setCurrentTip(COACH_TIPS[Math.floor(Math.random() * COACH_TIPS.length)]);
    }
  };

  const getAICoaching = async () => {
    try {
      setIsThinking(true);
      const res = await api.post(`/copilot/`);
      setCoachingMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setCoachingMessage("Le coach est indisponible pour le moment.");
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} animating={true} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <EmptyState 
          icon={AlertTriangle}
          title="Oups !"
          description={error || "Un problème technique est survenu lors de la récupération des données."}
          actionLabel="Réessayer"
          onAction={fetchData}
        />
      </View>
    );
  }

  const chartData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    values: [
      Math.floor((stats?.total_attendances || 0) * 0.2),
      Math.floor((stats?.total_attendances || 0) * 0.3),
      Math.floor((stats?.total_attendances || 0) * 0.1),
      Math.floor((stats?.total_attendances || 0) * 0.4),
    ]
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={Boolean(refreshing)} 
          onRefresh={onRefresh} 
          colors={[Colors.primary]} 
          progressBackgroundColor={Colors.surface}
        />
      }
    >
      <View style={styles.header}>
         <View style={styles.titleContainer}>
            <Text style={styles.title}>Plume<Text style={{ color: Colors.secondary }}>.ai</Text></Text>
         </View>
         <TouchableOpacity onPress={signOut} style={{ marginLeft: 'auto', padding: 8 }} testID="logout-button">
            <LogOut size={22} color={Colors.textSecondary} />
         </TouchableOpacity>
      </View>

      <View style={styles.welcome}>
        <Text style={styles.greeting}>Salut, {stats?.full_name?.split(' ')[0] || 'Joueur'} ! 👋</Text>
        <Text style={styles.subtitle}>Voici ton bilan d'assiduité Plume.</Text>
      </View>

      <TouchableOpacity 
        style={styles.reserveBanner} 
        onPress={() => navigation.navigate('Reservation')}
      >
        <View style={styles.reserveContent}>
          <Text style={styles.reserveTitle}>Réserver un terrain 🏸</Text>
          <Text style={styles.reserveSubtitle}>Vérifiez les disponibilités en direct.</Text>
        </View>
        <MapPin size={24} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        <View style={styles.row}>
          <StatCard label="Assiduité" value={`${stats?.attendance_rate || 0}%`} icon={TargetIcon} color="#22c55e" />
          <StatCard label="Séances" value={stats?.total_attendances || 0} icon={CalendarIcon} color="#3b82f6" />
        </View>
      </View>

      <AttendanceChart data={chartData} height={180} />

      {(isThinking || coachingMessage) && (
        <CoachingCard 
          message={coachingMessage} 
          isLoading={Boolean(isThinking)} 
          onClose={() => setCoachingMessage(null)}
        />
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.aiButton} 
          onPress={getAICoaching} 
          disabled={Boolean(isThinking)}
        >
          <SparkleIcon color={Colors.background} size={20} />
          <Text style={styles.aiButtonText}>Mon Bilan IA</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addSessionBtn} 
          onPress={() => navigation.navigate('Attendance')}
        >
          <TargetIcon color={Colors.text} size={24} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.historyBtn} 
          onPress={() => navigation.navigate('History')}
        >
          <ClockIcon color={Colors.textSecondary} size={24} />
        </TouchableOpacity>
        
        {user?.role === 'admin' && (
          <TouchableOpacity 
            style={[styles.historyBtn, { marginLeft: 'auto', backgroundColor: '#8b5cf620' }]} 
            onPress={() => navigation.navigate('AdminDashboard')}
          >
            <BarChart3 color="#8b5cf6" size={24} />
          </TouchableOpacity>
        )}
      </View>



      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Le saviez-vous ? 💡</Text>
        <Text style={styles.infoBody}>
          {currentTip}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { paddingVertical: 16, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  welcome: { marginBottom: 16 },
  greeting: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 2 },
  statsGrid: { marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 10 },
  aiButton: { flex: 1, backgroundColor: Colors.secondary, padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  aiButtonText: { color: Colors.background, fontWeight: '800', fontSize: 16 },
  addSessionBtn: { backgroundColor: Colors.primary, padding: 18, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  historyBtn: { backgroundColor: Colors.surface, padding: 18, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  infoCard: { backgroundColor: Colors.primary + '15', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: Colors.primary + '30', marginVertical: 10, marginBottom: 30 },
  reserveBanner: { backgroundColor: Colors.surface, padding: 18, borderRadius: 24, flexDirection: 'row', alignItems: 'center', marginVertical: 8, borderLeftWidth: 6, borderLeftColor: Colors.primary },
  reserveContent: { flex: 1 },
  reserveTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 2 },
  reserveSubtitle: { color: Colors.textSecondary, fontSize: 14 },
  infoTitle: { color: Colors.primary, fontWeight: '700', fontSize: 16, marginBottom: 4 },
  infoBody: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
});
