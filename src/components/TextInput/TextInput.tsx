import React from 'react';
import {View, Text, TextInput as RNTextInput, StyleSheet, TextInputProps, TextStyle} from 'react-native';
import {colors, spacing, borderRadius, typography} from '@utils/theme';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  const inputStyles: TextStyle[] = [styles.input];
  if (error) inputStyles.push(styles.inputError);
  if (style) inputStyles.push(style as TextStyle);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={inputStyles}
        placeholderTextColor={colors.gray500}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
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
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
