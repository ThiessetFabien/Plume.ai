import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Users, Target, Calendar, Award } from 'lucide-react-native';
import api from '../services/api';
import { Colors } from '../theme/colors';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. On récupère d'abord les joueurs pour en choisir un (ex: le premier)
      const playersRes = await api.get('/players/');
      if (playersRes.data.length === 0) {
        throw new Error("Aucun joueur trouvé en base.");
      }
      
      const playerId = playersRes.data[0].id;
      
      // 2. On récupère ses statistiques complètes
      const statsRes = await api.get(`/players/${playerId}/stats`);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Coaching en cours...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Text style={styles.subErrorText}>Vérifiez que le backend est lancé et accessible.</Text>
      </View>
    );
  }

  // Préparation des données pour le graphique (groupement par semaine fictif pour la démo)
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <View style={styles.welcome}>
        <Text style={styles.greeting}>Salut, {stats?.full_name?.split(' ')[0] || 'Joueur'} ! 👋</Text>
        <Text style={styles.subtitle}>Voici ton bilan d'assiduité Plume.</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.row}>
          <StatCard 
            label="Assiduité" 
            value={`${stats?.attendance_rate || 0}%`} 
            icon={Target} 
            color="#22c55e" 
          />
          <StatCard 
            label="Séances" 
            value={stats?.total_attendances || 0} 
            icon={Calendar} 
            color="#3b82f6" 
          />
        </View>
        <View style={styles.row}>
          <StatCard 
            label="Cible" 
            value={`${stats?.average_frequency || 0}/sem`} 
            icon={Award} 
            color="#f59e0b" 
          />
          <StatCard 
            label="Âge" 
            value={`${stats?.age || '?'} ans`} 
            icon={Users} 
            color="#a855f7" 
          />
        </View>
      </View>

      <AttendanceChart data={chartData} />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Le saviez-vous ?</Text>
        <Text style={styles.infoBody}>
          Une régularité de 2 séances par semaine augmente vos chances de progression technique de 40% sur 3 mois.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 40,
  },
  subErrorText: {
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  welcome: {
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    backgroundColor: Colors.primary + '15',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    marginVertical: 20,
    marginBottom: 40,
  },
  infoTitle: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  infoBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  }
});
