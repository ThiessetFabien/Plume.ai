import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../theme/colors';
import api from '../services/api';
import { ShieldCheck, Users, Calendar, AlertTriangle, TrendingUp, Ghost, Activity } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur fetchStats:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les statistiques globales.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const maxDaysCount = stats ? Math.max(...(stats.peak_days?.map(d => d.count) || [1]), 1) : 1;
  const maxHoursCount = stats ? Math.max(...(stats.peak_hours?.map(h => h.count) || [1]), 1) : 1;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <View style={styles.header}>
        <ShieldCheck color={Colors.primary} size={32} />
        <Text style={styles.title}>Espace Bureau</Text>
        <Text style={styles.subtitle}>Vue d'ensemble du club</Text>
      </View>

      {stats ? (
        <>
          <View style={styles.peaksSection}>
            <View style={styles.sectionHeader}>
              <TrendingUp color={Colors.primary} size={20} />
              <Text style={styles.sectionTitle}>Analyse d'Assiduité</Text>
            </View>
            
            <View style={styles.peakBlock}>
              <Text style={styles.peakTitle}>Jours les plus actifs</Text>
              {stats.peak_days?.map((item, idx) => {
                const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
                const widthPercent = (item.count / maxDaysCount) * 100;
                return (
                  <View key={idx} style={styles.progressBarContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>{days[item.day]}</Text>
                      <Text style={styles.progressValue}>{item.count} séances</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${widthPercent}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.peakBlock}>
              <Text style={styles.peakTitle}>Heures de pointe</Text>
              {stats.peak_hours?.map((item, idx) => {
                const widthPercent = (item.count / maxHoursCount) * 100;
                return (
                  <View key={idx} style={styles.progressBarContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>{item.hour}h00</Text>
                      <Text style={styles.progressValue}>{item.count} séances</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${widthPercent}%`, backgroundColor: '#f59e0b' }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.sectionHeader}>
              <Users color={Colors.primary} size={20} />
              <Text style={styles.sectionTitle}>Chiffres Clés</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Users color={Colors.textSecondary} size={24} />
                <Text style={styles.statValue}>{stats.total_players}</Text>
                <Text style={styles.statLabel}>Membres Inscrits</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ghost color={Colors.textSecondary} size={24} />
                <Text style={styles.statValue}>{stats.ghost_players_count}</Text>
                <Text style={styles.statLabel}>Membres Fantômes</Text>
              </View>
              
              <View style={styles.statCard}>
                <Calendar color={Colors.textSecondary} size={24} />
                <Text style={styles.statValue}>{stats.total_reservations}</Text>
                <Text style={styles.statLabel}>Réservations</Text>
              </View>
              
              <View style={styles.statCard}>
                <Activity color={Colors.textSecondary} size={24} />
                <Text style={styles.statValue}>{stats.total_attendances}</Text>
                <Text style={styles.statLabel}>Séances Déclarées</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.center}>
          <Text style={styles.errorText}>Aucune donnée disponible</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.surface,
    width: '48%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginVertical: 10,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
  peaksSection: {
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  peakBlock: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  peakTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  }
});
