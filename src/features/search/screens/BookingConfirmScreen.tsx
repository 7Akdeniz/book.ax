import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParamList} from '@navigation/types';
import {Button} from '@components/Button';
import {colors, spacing, borderRadius, typography, shadows} from '@utils/theme';
import {formatCurrency, formatDate, calculateNights} from '@utils/helpers';

type Props = NativeStackScreenProps<SearchStackParamList, 'BookingConfirm'>;

export const BookingConfirmScreen: React.FC<Props> = ({navigation, route}) => {
  const {hotelId, roomId, checkIn, checkOut, guests} = route.params;
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - würde normalerweise vom Backend kommen
  const hotel = {
    name: 'Hotel Adlon Kempinski',
    city: 'Berlin',
  };
  const room = {
    name: 'Deluxe Zimmer',
    pricePerNight: 350,
  };

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 3;
  const roomTotal = room.pricePerNight * nights;
  const taxesAndFees = roomTotal * 0.15; // 15% Steuern
  const totalPrice = roomTotal + taxesAndFees;

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    
    // Simuliere API-Call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Buchung bestätigt! ✅',
        'Ihre Buchung wurde erfolgreich abgeschlossen. Eine Bestätigung wurde an Ihre E-Mail gesendet.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SearchHome'),
          },
        ],
      );
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Buchung bestätigen</Text>

      {/* Hotel Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Unterkunft</Text>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.hotelCity}>{hotel.city}</Text>
        <Text style={styles.roomName}>{room.name}</Text>
      </View>

      {/* Booking Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Buchungsdetails</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Check-in</Text>
          <Text style={styles.detailValue}>
            {checkIn ? formatDate(checkIn) : 'Nicht ausgewählt'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Check-out</Text>
          <Text style={styles.detailValue}>
            {checkOut ? formatDate(checkOut) : 'Nicht ausgewählt'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Anzahl Nächte</Text>
          <Text style={styles.detailValue}>{nights}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gäste</Text>
          <Text style={styles.detailValue}>{guests}</Text>
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preisübersicht</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            {formatCurrency(room.pricePerNight)} × {nights} Nächte
          </Text>
          <Text style={styles.priceValue}>{formatCurrency(roomTotal)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Steuern und Gebühren</Text>
          <Text style={styles.priceValue}>{formatCurrency(taxesAndFees)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Gesamtpreis</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
        </View>
      </View>

      {/* Cancellation Policy */}
      <View style={styles.policyCard}>
        <Text style={styles.policyTitle}>📋 Stornierungsbedingungen</Text>
        <Text style={styles.policyText}>
          Kostenlose Stornierung bis 24 Stunden vor Check-in. Danach wird der volle Betrag
          berechnet.
        </Text>
      </View>

      {/* Confirm Button */}
      <Button
        title="Buchung bestätigen"
        onPress={handleConfirmBooking}
        loading={isLoading}
        style={styles.confirmButton}
      />

      <Button
        title="Abbrechen"
        onPress={() => navigation.goBack()}
        variant="outline"
        disabled={isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  hotelName: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  hotelCity: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roomName: {
    ...typography.body,
    color: colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  priceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  priceValue: {
    ...typography.body,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  totalLabel: {
    ...typography.h3,
  },
  totalValue: {
    ...typography.h2,
    color: colors.primary,
  },
  policyCard: {
    backgroundColor: colors.gray100,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  policyTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  policyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  confirmButton: {
    marginBottom: spacing.md,
  },
});
