import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import { Colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

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
    </NavigationContainer>
  );
}
