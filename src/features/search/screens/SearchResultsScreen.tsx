import React from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParamList} from '@navigation/types';
import {HotelCard} from '@components/HotelCard';
import {useSearch} from '../hooks/useSearch';
import {colors, spacing, typography} from '@utils/theme';
import {Hotel} from '../../../types/models';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResults'>;

export const SearchResultsScreen: React.FC<Props> = ({navigation, route}) => {
  const {destination, checkIn, checkOut, guests} = route.params;
  const {results, isLoading} = useSearch();

  const handleHotelPress = (hotel: Hotel) => {
    navigation.navigate('HotelDetails', {hotelId: hotel.id});
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>{destination}</Text>
      <Text style={styles.subtitle}>
        {checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Flexible Daten'}
      </Text>
      <Text style={styles.resultCount}>
        {results.length} {results.length === 1 ? 'Hotel' : 'Hotels'} gefunden
      </Text>
      <Text style={styles.guestsText}>Für {guests} Gäste</Text>
    </View>
  );

  const renderHotel = ({item}: {item: Hotel}) => (
    <HotelCard hotel={item} onPress={() => handleHotelPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>😔</Text>
      <Text style={styles.emptyTitle}>Keine Hotels gefunden</Text>
      <Text style={styles.emptySubtitle}>Versuchen Sie es mit anderen Suchkriterien</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Hotels werden geladen...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderHotel}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  resultCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  guestsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
