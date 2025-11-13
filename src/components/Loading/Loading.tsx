import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {colors, spacing, typography} from '@utils/theme';

interface LoadingProps {
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({text = 'Lädt...'}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
