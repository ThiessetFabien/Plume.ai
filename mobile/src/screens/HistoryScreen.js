import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Sparkles, Calendar, MessageSquareOff } from 'lucide-react-native';
import api from '../services/api';
import { Colors } from '../theme/colors';
import { EmptyState } from '../components/EmptyState';

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const playersRes = await api.get('/players/');
      if (playersRes.data.length === 0) throw new Error("Aucun joueur trouvé.");
      const playerId = playersRes.data[0].id;

      const res = await api.get(`/players/${playerId}/coaching-history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger l'historique.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <Calendar color={Colors.textSecondary} size={14} />
        <Text style={styles.dateText}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
          }) : 'Date inconnue'}
        </Text>
      </View>
      <View style={styles.messageContent}>
         <Sparkles color={Colors.secondary} size={18} style={styles.quoteIcon} />
         <Text style={styles.messageText}>{item.message || 'Aucun message.'}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={Boolean(refreshing)} 
            onRefresh={onRefresh} 
            colors={[Colors.primary]} 
            progressBackgroundColor={Colors.surface}
          />
        }
        ListEmptyComponent={
          <EmptyState 
            icon={MessageSquareOff}
            title="Aucun conseil"
            description="Tes conseils personnalisés apparaîtront ici dès que tu auras enregistré des séances."
            actionLabel="S'entraîner maintenant"
            onAction={() => fetchHistory()}
          />
        }
      />
    </View>
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
  },
  list: {
    padding: 20,
  },
  historyCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  messageContent: {
    flexDirection: 'row',
    gap: 12,
  },
  quoteIcon: {
    marginTop: 2,
  },
  messageText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
