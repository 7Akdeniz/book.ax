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
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';
import {Button} from '@components/Button';
import {colors, spacing, borderRadius, typography} from '@utils/theme';
import {isValidEmail} from '@utils/helpers';
import {supabase} from '@services/supabase';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError('E-Mail ist erforderlich');
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError('Ungültige E-Mail-Adresse');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const {error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'bookax://reset-password', // Deep Link
      });

      if (error) throw error;

      setEmailSent(true);
      Alert.alert(
        'E-Mail gesendet',
        'Wir haben Ihnen eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts gesendet.',
      );
    } catch (error: any) {
      Alert.alert('Fehler', error.message || 'Fehler beim Senden der E-Mail');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>📧</Text>
          <Text style={styles.successTitle}>E-Mail gesendet!</Text>
          <Text style={styles.successMessage}>
            Wir haben Ihnen eine E-Mail an{' '}
            <Text style={styles.emailText}>{email}</Text> gesendet.
          </Text>
          <Text style={styles.successSubMessage}>
            Bitte überprüfen Sie Ihr Postfach und folgen Sie den Anweisungen zum
            Zurücksetzen Ihres Passworts.
          </Text>

          <View style={styles.successActions}>
            <Button
              title="Zurück zum Login"
              onPress={() => navigation.navigate('Login')}
              style={styles.backButton}
            />
            <TouchableOpacity onPress={handleResetPassword}>
              <Text style={styles.resendText}>E-Mail erneut senden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Zurück</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.icon}>🔑</Text>
            <Text style={styles.title}>Passwort vergessen?</Text>
            <Text style={styles.subtitle}>
              Kein Problem! Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen
              einen Link zum Zurücksetzen Ihres Passworts.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-Mail-Adresse</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="ihre@email.com"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                autoFocus
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <Button
              title="Link zum Zurücksetzen senden"
              onPress={handleResetPassword}
              loading={isLoading}
              style={styles.resetButton}
            />

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Hinweis</Text>
                <Text style={styles.infoText}>
                  Falls Sie keine E-Mail erhalten, überprüfen Sie bitte Ihren
                  Spam-Ordner oder versuchen Sie es erneut.
                </Text>
              </View>
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
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backArrow: {
    fontSize: 24,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 22,
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
  resetButton: {
    marginBottom: spacing.xl,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  // Success State
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  successMessage: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: colors.primary,
  },
  successSubMessage: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  successActions: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  resendText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
