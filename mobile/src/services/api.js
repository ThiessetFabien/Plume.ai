import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Gestion dynamique de l'IP du serveur.
 * - En développement (Expo Go) : utilise l'IP du Metro bundler avec http.
 * - En production (build natif) : utilise https si EXPO_PUBLIC_API_URL est défini.
 */
const getBaseURL = () => {
  // Variable d'env pour la production (ex: https://api.plume.ai)
  const productionUrl = process.env.EXPO_PUBLIC_API_URL;
  if (productionUrl) {
    return productionUrl;
  }

  // Mode développement : IP dynamique depuis Metro (Expo Go)
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    return 'http://localhost:8000';
  }

  const ip = hostUri.split(':').shift();
  // Protocole configurable, http par défaut en dev local
  const protocol = process.env.EXPO_PUBLIC_API_PROTOCOL || 'http';
  return `${protocol}://${ip}:8000`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de log uniquement en développement
if (__DEV__) {
  console.log(`🚀 API BaseURL: ${api.defaults.baseURL}`);
}

export default api;
