import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Colors } from './src/theme/colors';

// Écrans
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

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
      text1Style={{ fontSize: 16, fontWeight: '800', color: Colors.text }}
      text2Style={{ fontSize: 13, color: Colors.textSecondary }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.error, backgroundColor: Colors.surface, height: 70 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '800', color: Colors.text }}
      text2Style={{ fontSize: 13, color: Colors.textSecondary }}
    />
  )
};

const Navigation = () => {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background }
      }}
    >
      {!userToken ? (
        // --- STACK AUTHENTIFICATION ---
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Group>
      ) : (
        // --- STACK APPLICATION ---
        <Stack.Group>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen} 
            options={{ title: 'Historique Coaching' }}
          />
          <Stack.Screen 
            name="Reservation" 
            component={ReservationScreen} 
            options={{ title: 'Réserver un terrain' }}
          />
          <Stack.Screen 
            name="Attendance" 
            component={AttendanceScreen} 
            options={{ title: 'Déclarer une séance' }}
          />
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboardScreen} 
            options={{ title: 'Administration' }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </AuthProvider>
  );
}
