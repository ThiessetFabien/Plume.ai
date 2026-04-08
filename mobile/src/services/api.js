import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Gestion dynamique de l'IP du serveur.
 * Indispensable pour Expo Go afin de communiquer avec le backend local.
 */
const getBaseURL = () => {
  // hostUri ressemble à "192.168.1.XX:8081"
  const hostUri = Constants.expoConfig?.hostUri;
  
  if (!hostUri) {
    // Fallback pour le simulateur ou cas imprévu
    return 'http://localhost:8000';
  }

  const ip = hostUri.split(':').shift();
  return `http://${ip}:8000`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log(`🚀 API BaseURL: ${api.defaults.baseURL}`);

export default api;
