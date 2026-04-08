import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from './theme/colors';
import { Activity } from 'lucide-react-native';

import DashboardScreen from './screens/DashboardScreen';

export default function AppContent() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Activity color={Colors.secondary} size={32} />
        <Text style={styles.title}>Plume<Text style={{ color: Colors.secondary }}>.ai</Text></Text>
      </View>

      <DashboardScreen />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  card: {
    margin: 24,
    padding: 24,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    ...Shadows.medium,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 12,
    letterSpacing: 2,
  }
});
