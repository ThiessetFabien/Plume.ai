import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import { Colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

/**
 * Configuration des Toasts personnalisés pour Plume.ai
 */
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.success, backgroundColor: Colors.surface, height: 70 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text
      }}
      text2Style={{
        fontSize: 13,
        color: Colors.textSecondary
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.error, backgroundColor: Colors.surface, height: 70 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text
      }}
      text2Style={{
        fontSize: 13,
        color: Colors.textSecondary
      }}
    />
  )
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          }
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ 
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{ 
            title: 'Historique Coaching',
            headerShown: true
          }}
        />
        <Stack.Screen 
          name="Reservation" 
          component={ReservationScreen} 
          options={{ 
            title: 'Réserver un terrain',
            headerShown: true
          }}
        />
        <Stack.Screen 
          name="Attendance" 
          component={AttendanceScreen} 
          options={{ 
            title: 'Déclarer une séance',
            headerShown: true
          }}
        />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}
