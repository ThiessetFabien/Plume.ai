import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier si un token existe déjà au démarrage
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Optionnel : On pourrait vérifier la validité du token ici via /players/me
        const response = await api.get('/players/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setUserToken(token);
      }
    } catch (e) {
      console.log('Erreur checkToken:', e);
      await AsyncStorage.removeItem('userToken');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const token = response.data.access_token;
      await AsyncStorage.setItem('userToken', token);
      
      // Récupérer les infos de l'utilisateur
      const userResponse = await api.get('/players/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(userResponse.data);
      setUserToken(token);
    } catch (e) {
      console.log('Erreur signIn:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (fullName, email, password, age, frequency, gender) => {
    setIsLoading(true);
    try {
      await api.post('/players/', {
        full_name: fullName,
        email,
        password,
        age: parseInt(age),
        average_frequency: parseFloat(frequency),
        gender: gender
      });
      // Après inscription, on connecte directement
      await signIn(email, password);
    } catch (e) {
      console.log('Erreur signUp:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setUser(null);
    } catch (e) {
      console.log('Erreur signOut:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
