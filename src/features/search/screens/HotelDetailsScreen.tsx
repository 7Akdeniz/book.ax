import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParamList} from '@navigation/types';
import {Button} from '@components/Button';
import {searchService} from '../searchService';
import {Hotel} from '../../../types/models';
import {colors, spacing, borderRadius, typography, shadows} from '@utils/theme';
import {formatCurrency} from '@utils/helpers';

type Props = NativeStackScreenProps<SearchStackParamList, 'HotelDetails'>;

const {width} = Dimensions.get('window');

export const HotelDetailsScreen: React.FC<Props> = ({navigation, route}) => {
  const {hotelId} = route.params;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex] = useState(0);

  const loadHotelDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await searchService.getHotelById(hotelId);
      setHotel(data);
    } catch (error) {
      console.error('Error loading hotel details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    loadHotelDetails();
  }, [loadHotelDetails]);

  const handleBookNow = () => {
    if (hotel) {
      navigation.navigate('BookingConfirm', {
        hotelId: hotel.id,
        roomId: '1', // TODO: Room selection
        checkIn: '', // TODO: From search filters
        checkOut: '',
        guests: 2,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Hotel nicht gefunden</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: hotel.images[currentImageIndex]}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageIndicators}>
          {hotel.images.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === currentImageIndex && styles.activeIndicator]}
            />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {/* Hotel Info */}
        <View style={styles.header}>
          <Text style={styles.name}>{hotel.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {hotel.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({hotel.reviewCount} Bewertungen)</Text>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.location}>
          📍 {hotel.address}, {hotel.city}, {hotel.country}
        </Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beschreibung</Text>
          <Text style={styles.description}>{hotel.description}</Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ausstattung</Text>
          <View style={styles.amenitiesContainer}>
            {hotel.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Price & Book */}
        <View style={styles.priceSection}>
          <View>
            <Text style={styles.priceLabel}>Preis pro Nacht</Text>
            <Text style={styles.price}>{formatCurrency(hotel.pricePerNight, hotel.currency)}</Text>
          </View>
          <Button title="Jetzt buchen" onPress={handleBookNow} style={styles.bookButton} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    opacity: 0.5,
  },
  activeIndicator: {
    opacity: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...typography.body,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  reviewCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  location: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityChip: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  amenityText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  priceLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  bookButton: {
    minWidth: 150,
  },
});
