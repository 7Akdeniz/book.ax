import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParamList} from '@navigation/types';
import {Button} from '@components/Button';
import {colors, spacing, borderRadius, typography, shadows} from '@utils/theme';
import {searchService} from '@features/search/searchService';
import {Hotel} from '../../../types/models';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchHome'>;

const {width} = Dimensions.get('window');

const POPULAR_DESTINATIONS = [
  {id: '1', name: 'Berlin', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800', hotels: 2543},
  {id: '2', name: 'München', image: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800', hotels: 1876},
  {id: '3', name: 'Hamburg', image: 'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=800', hotels: 1432},
  {id: '4', name: 'Köln', image: 'https://images.unsplash.com/photo-1605641646959-f048910812ba?w=800', hotels: 987},
];

const PROPERTY_TYPES = [
  {id: '1', icon: '🏨', name: 'Hotels', count: 15234},
  {id: '2', icon: '🏠', name: 'Apartments', count: 8765},
  {id: '3', icon: '🏡', name: 'Ferienhäuser', count: 5432},
  {id: '4', icon: '🏰', name: 'Villen', count: 2109},
];

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    loadFeaturedHotels();
  }, []);

  const loadFeaturedHotels = async () => {
    try {
      const hotels = await searchService.getFeaturedHotels();
      setFeaturedHotels(hotels.slice(0, 3));
    } catch (error) {
      console.error('Error loading featured hotels:', error);
    }
  };

  const handleSearch = () => {
    if (destination.trim()) {
      navigation.navigate('SearchResults', {
        destination: destination.trim(),
        checkIn,
        checkOut,
        guests: parseInt(guests, 10) || 2,
      });
    }
  };

  const handleDestinationPress = (city: string) => {
    setDestination(city);
    navigation.navigate('SearchResults', {
      destination: city,
      checkIn,
      checkOut,
      guests: parseInt(guests, 10) || 2,
    });
  };

  const handleHotelPress = (hotelId: string) => {
    navigation.navigate('HotelDetails', {hotelId});
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section mit Search */}
      <View style={styles.heroSection}>
        <Image
          source={{uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'}}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Finde deine perfekte Unterkunft</Text>
          <Text style={styles.heroSubtitle}>Über 500.000 Hotels weltweit</Text>

          {/* Search Card */}
          <View style={styles.searchCard}>
            <View style={styles.searchRow}>
              <View style={styles.searchIcon}>
                <Text style={styles.iconText}>📍</Text>
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Wohin möchtest du reisen?"
                value={destination}
                onChangeText={setDestination}
                placeholderTextColor={colors.gray500}
              />
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Text style={styles.dateLabel}>Check-in</Text>
                <TextInput
                  style={styles.dateText}
                  placeholder="Datum"
                  value={checkIn}
                  onChangeText={setCheckIn}
                  placeholderTextColor={colors.gray400}
                />
              </View>
              <View style={styles.dateSeparator} />
              <View style={styles.dateInput}>
                <Text style={styles.dateLabel}>Check-out</Text>
                <TextInput
                  style={styles.dateText}
                  placeholder="Datum"
                  value={checkOut}
                  onChangeText={setCheckOut}
                  placeholderTextColor={colors.gray400}
                />
              </View>
            </View>

            <View style={styles.guestsRow}>
              <Text style={styles.guestsLabel}>👥 Gäste</Text>
              <TextInput
                style={styles.guestsInput}
                value={guests}
                onChangeText={setGuests}
                keyboardType="number-pad"
              />
            </View>

            <Button title="Suchen" onPress={handleSearch} />
          </View>
        </View>
      </View>

      {/* Beliebte Reiseziele */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beliebte Reiseziele</Text>
        <Text style={styles.sectionSubtitle}>
          Entdecke die beliebtesten Städte für deinen nächsten Urlaub
        </Text>

        <View style={styles.destinationsGrid}>
          {POPULAR_DESTINATIONS.map(dest => (
            <TouchableOpacity
              key={dest.id}
              style={styles.destinationCard}
              onPress={() => handleDestinationPress(dest.name)}>
              <Image source={{uri: dest.image}} style={styles.destinationImage} />
              <View style={styles.destinationOverlay}>
                <Text style={styles.destinationName}>{dest.name}</Text>
                <Text style={styles.destinationHotels}>{dest.hotels} Hotels</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Unterkunftstypen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nach Unterkunftstyp suchen</Text>

        <View style={styles.typesGrid}>
          {PROPERTY_TYPES.map(type => (
            <TouchableOpacity key={type.id} style={styles.typeCard}>
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text style={styles.typeName}>{type.name}</Text>
              <Text style={styles.typeCount}>{type.count.toLocaleString('de-DE')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Hotels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empfohlene Hotels</Text>
        <Text style={styles.sectionSubtitle}>Von uns ausgewählte Top-Unterkünfte</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hotelsScroll}>
          {featuredHotels.map(hotel => (
            <TouchableOpacity
              key={hotel.id}
              style={styles.hotelCard}
              onPress={() => handleHotelPress(hotel.id)}>
              <Image
                source={{uri: hotel.images[0]}}
                style={styles.hotelImage}
              />
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName} numberOfLines={1}>
                  {hotel.name}
                </Text>
                <Text style={styles.hotelLocation} numberOfLines={1}>
                  📍 {hotel.city}, {hotel.country}
                </Text>
                <View style={styles.hotelFooter}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {hotel.rating.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.hotelPrice}>
                    ab {hotel.pricePerNight}€
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoTitle}>🎉 Spare bis zu 30% bei deiner ersten Buchung!</Text>
        <Text style={styles.promoText}>
          Melde dich jetzt an und sichere dir exklusive Angebote
        </Text>
        <Button
          title="Jetzt anmelden"
          variant="secondary"
          style={styles.promoButton}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Hero Section
  heroSection: {
    height: 520,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: spacing.lg,
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontSize: 28,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
  },

  // Search Card
  searchCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    paddingBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: 24,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    paddingBottom: spacing.md,
  },
  dateInput: {
    flex: 1,
  },
  dateSeparator: {
    width: 1,
    backgroundColor: colors.gray200,
    marginHorizontal: spacing.md,
  },
  dateLabel: {
    ...typography.bodySmall,
    color: colors.gray600,
    marginBottom: spacing.xxs,
  },
  dateText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  guestsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  guestsLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  guestsInput: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'right',
    minWidth: 50,
  },

  // Sections
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Destinations Grid
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: (width - spacing.lg * 3) / 2,
    height: 180,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  destinationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  destinationName: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.xxs,
  },
  destinationHotels: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.9,
  },

  // Property Types Grid
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  typeIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  typeName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  typeCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Featured Hotels
  hotelsScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  hotelCard: {
    width: 280,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
    ...shadows.md,
  },
  hotelImage: {
    width: '100%',
    height: 180,
  },
  hotelInfo: {
    padding: spacing.md,
  },
  hotelName: {
    ...typography.h4,
    marginBottom: spacing.xs,
  },
  hotelLocation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  ratingText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  hotelPrice: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
  },

  // Promo Banner
  promoBanner: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  promoTitle: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  promoText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  promoButton: {
    backgroundColor: colors.white,
  },
});
