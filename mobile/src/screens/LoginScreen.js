import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import RacketIcon from '../components/RacketIcon';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Échec de connexion', 'Email ou mot de passe incorrect.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <RacketIcon size={44} color={Colors.secondary} />
          </View>
          <Text style={styles.title}>Plume<Text style={{color: Colors.secondary}}>.ai</Text></Text>
          <Text style={styles.subtitle}>Votre copilote badminton intelligent</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={Colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeIcon}>
              {showPassword
                ? <EyeOff size={20} color={Colors.textSecondary} />
                : <Eye size={20} color={Colors.textSecondary} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotLink}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Se connecter</Text>
                <ArrowRight size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Nouveau sur Plume ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: Colors.text,
    fontSize: 16,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    marginTop: -4,
  },
  forgotText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  linkText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: '700',
  },
});
