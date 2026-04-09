import React from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, Text } from 'react-native';
import { Colors } from './theme/colors';
import { Activity } from 'lucide-react-native';
import DashboardScreen from './screens/DashboardScreen';

export default function AppContent() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Activity color={Colors.secondary} size={32} />
        <Text style={styles.title}>
          Plume<Text style={{ color: Colors.secondary }}>.ai</Text>
        </Text>
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
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  }
});
