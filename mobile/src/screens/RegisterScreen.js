import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { User, Mail, Lock, Calendar, Activity, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [frequency, setFrequency] = useState('');
  const [gender, setGender] = useState('M');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { signUp, isLoading } = useAuth();

  const validatePassword = (pwd) => {
    const rules = [
      { test: pwd.length >= 12, msg: '12 caractères minimum' },
      { test: /[A-Z]/.test(pwd), msg: 'une majuscule' },
      { test: /[a-z]/.test(pwd), msg: 'une minuscule' },
      { test: /[0-9]/.test(pwd), msg: 'un chiffre' },
      { test: /[^A-Za-z0-9]/.test(pwd), msg: 'un caractère spécial' },
    ];
    const failed = rules.filter(r => !r.test).map(r => r.msg);
    return failed;
  };

  const handleRegister = async () => {
    // Reset errors
    const errors = {};
    if (!fullName) errors.fullName = 'Nom requis';
    if (!email) errors.email = 'Email requis';
    if (!password) errors.password = 'Mot de passe requis';
    if (!age) errors.age = 'Âge requis';
    if (!frequency) errors.frequency = 'Fréquence requise';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setFieldErrors({ password: 'Mot de passe trop faible (ANSSI)' });
      return;
    }

    setFieldErrors({});

    try {
      await signUp(fullName, email, password, age, frequency, gender);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      const msg = detail === 'Cet email est déjà enregistré.'
        ? 'Cet email est déjà utilisé.'
        : 'Échec de l\'inscription.';
      setFieldErrors({ email: msg });
      Alert.alert('Erreur', msg);
    }
  };

  const getPasswordRuleStatus = (regex, minLen) => {
    if (!password) return Colors.textSecondary;
    const test = minLen ? password.length >= minLen : regex.test(password);
    return test ? '#4ade80' : Colors.textSecondary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Créer un profil</Text>
            <Text style={styles.subtitle}>Rejoignez la communauté Plume.ai</Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputGroup, fieldErrors.fullName && styles.inputError]}>
              <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nom complet"
                placeholderTextColor={Colors.textSecondary}
                value={fullName}
                onChangeText={(v) => { setFullName(v); setFieldErrors(prev => ({...prev, fullName: null})); }}
              />
            </View>
            {fieldErrors.fullName && <Text style={styles.errorText}>{fieldErrors.fullName}</Text>}

            <View style={[styles.inputGroup, fieldErrors.email && styles.inputError]}>
              <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={(v) => { setEmail(v); setFieldErrors(prev => ({...prev, email: null})); }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email}</Text>}

            <View style={[styles.inputGroup, fieldErrors.password && styles.inputError]}>
              <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={(v) => { setPassword(v); setFieldErrors(prev => ({...prev, password: null})); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeIcon}>
                {showPassword
                  ? <EyeOff size={20} color={Colors.textSecondary} />
                  : <Eye size={20} color={Colors.textSecondary} />}
              </TouchableOpacity>
            </View>
            {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}

            {/* Aide Mémoire ANSSI */}
            <View style={styles.pwdRulesContainer}>
              <View style={styles.ruleRow}>
                <View style={[styles.ruleDot, { backgroundColor: getPasswordRuleStatus(null, 12)} ]} />
                <Text style={[styles.ruleText, { color: getPasswordRuleStatus(null, 12) }]}>12 caractères</Text>
              </View>
              <View style={styles.ruleRow}>
                <View style={[styles.ruleDot, { backgroundColor: getPasswordRuleStatus(/[A-Z]/)} ]} />
                <Text style={[styles.ruleText, { color: getPasswordRuleStatus(/[A-Z]/) }]}>Majuscule</Text>
              </View>
              <View style={styles.ruleRow}>
                <View style={[styles.ruleDot, { backgroundColor: getPasswordRuleStatus(/[0-9]/)} ]} />
                <Text style={[styles.ruleText, { color: getPasswordRuleStatus(/[0-9]/) }]}>Chiffre</Text>
              </View>
              <View style={styles.ruleRow}>
                <View style={[styles.ruleDot, { backgroundColor: getPasswordRuleStatus(/[^A-Za-z0-9]/)} ]} />
                <Text style={[styles.ruleText, { color: getPasswordRuleStatus(/[^A-Za-z0-9]/) }]}>Spécial (!@#$)</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 0.4, marginRight: 12 }}>
                <View style={[styles.inputGroup, fieldErrors.age && styles.inputError, { marginBottom: 0 }]}>
                  <Calendar size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Âge"
                    placeholderTextColor={Colors.textSecondary}
                    value={age}
                    onChangeText={(v) => { setAge(v); setFieldErrors(prev => ({...prev, age: null})); }}
                    keyboardType="numeric"
                  />
                </View>
                {fieldErrors.age && <Text style={styles.errorText}>{fieldErrors.age}</Text>}
              </View>
              <View style={{ flex: 0.6 }}>
                <View style={[styles.inputGroup, fieldErrors.frequency && styles.inputError, { marginBottom: 0 }]}>
                  <Activity size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Séances/sem"
                    placeholderTextColor={Colors.textSecondary}
                    value={frequency}
                    onChangeText={(v) => { setFrequency(v); setFieldErrors(prev => ({...prev, frequency: null})); }}
                    keyboardType="numeric"
                  />
                </View>
                {fieldErrors.frequency && <Text style={styles.errorText}>{fieldErrors.frequency}</Text>}
              </View>
            </View>

            {/* Sélecteur de Genre Premium */}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Sexe / Genre</Text>
              <View style={styles.genderGroup}>
                {['M', 'F', 'Autre'].map((g) => (
                  <TouchableOpacity 
                    key={g} 
                    style={[styles.genderButton, gender === g && styles.genderButtonSelected]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderText, gender === g && styles.genderTextSelected]}>
                      {g === 'M' ? 'Homme' : g === 'F' ? 'Femme' : 'Autre'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
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
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.05)',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  pwdRulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  ruleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  ruleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
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
  genderContainer: {
    marginBottom: 16,
  },
  genderLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600'
  },
  genderGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  genderButton: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderButtonSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  genderText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: Colors.background,
    fontWeight: '800',
  },
  registerButton: {
    backgroundColor: Colors.secondary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '800',
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
