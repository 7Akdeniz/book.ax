import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextStyle,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';
import {Button} from '@components/Button';
import {useAuth} from '../hooks/useAuth';
import {colors, spacing, borderRadius, typography} from '@utils/theme';
import {isValidEmail} from '@utils/helpers';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const {login, isLoading} = useAuth();

  const validateForm = (): boolean => {
    let valid = true;

    if (!email) {
      setEmailError('E-Mail ist erforderlich');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Ungültige E-Mail-Adresse');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Passwort ist erforderlich');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Passwort muss mindestens 6 Zeichen lang sein');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(email, password);
    if (!result.success) {
      Alert.alert('Fehler', result.error || 'Login fehlgeschlagen');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>🏨 Booking Platform</Text>
          <Text style={styles.subtitle}>Willkommen zurück!</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-Mail</Text>
              <TextInput
                style={(() => {
                  const inputStyles: TextStyle[] = [styles.input];
                  if (emailError) inputStyles.push(styles.inputError);
                  return inputStyles;
                })()}
                placeholder="ihre@email.com"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Passwort</Text>
              <TextInput
                style={(() => {
                  const inputStyles: TextStyle[] = [styles.input];
                  if (passwordError) inputStyles.push(styles.inputError);
                  return inputStyles;
                })()}
                placeholder="••••••••"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setPasswordError('');
                }}
                secureTextEntry
                autoCapitalize="none"
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <Button
              title="Anmelden"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Noch kein Konto? </Text>
              <Button
                title="Registrieren"
                onPress={() => navigation.navigate('Register')}
                variant="outline"
                size="small"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.h3,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
