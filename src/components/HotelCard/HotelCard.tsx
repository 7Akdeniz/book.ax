import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Hotel} from '../../types/models';
import {colors, spacing, borderRadius, shadows, typography} from '@utils/theme';
import {formatCurrency} from '@utils/helpers';

interface HotelCardProps {
  hotel: Hotel;
  onPress: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({hotel, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{uri: hotel.images[0]}} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {hotel.name}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {hotel.city}, {hotel.country}
        </Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {hotel.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({hotel.reviewCount})</Text>
          </View>
          <Text style={styles.price}>
            {formatCurrency(hotel.pricePerNight, hotel.currency)}
            <Text style={styles.priceUnit}> / Nacht</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: spacing.md,
  },
  name: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  location: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  reviews: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
  },
  priceUnit: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
