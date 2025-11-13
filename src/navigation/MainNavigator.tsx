import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabParamList, SearchStackParamList} from './types';
import {SearchHomeScreen} from '@features/search/screens/SearchHomeScreen';
import {SearchResultsScreen} from '@features/search/screens/SearchResultsScreen';
import {HotelDetailsScreen} from '@features/search/screens/HotelDetailsScreen';
import {BookingConfirmScreen} from '@features/search/screens/BookingConfirmScreen';
import {colors} from '@utils/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();

const SearchNavigator = () => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: colors.white,
        headerTitleStyle: {fontWeight: 'bold'},
      }}>
      <SearchStack.Screen
        name="SearchHome"
        component={SearchHomeScreen}
        options={{title: 'Hotels suchen'}}
      />
      <SearchStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{title: 'Suchergebnisse'}}
      />
      <SearchStack.Screen
        name="HotelDetails"
        component={HotelDetailsScreen}
        options={{title: 'Hotel Details'}}
      />
      <SearchStack.Screen
        name="BookingConfirm"
        component={BookingConfirmScreen}
        options={{title: 'Buchung bestätigen'}}
      />
    </SearchStack.Navigator>
  );
};

// Placeholder components
import {View, Text, StyleSheet} from 'react-native';
import {Button} from '@components/Button';
import {useAuth} from '@features/auth/hooks/useAuth';

const BookingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📋 Meine Buchungen</Text>
      <Text style={styles.subtext}>Hier sehen Sie Ihre Buchungen</Text>
    </View>
  );
};

const ProfileScreen = () => {
  const {user, logout} = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Profil</Text>
      <Text style={styles.subtext}>
        Willkommen, {user?.firstName || 'Gast'}!
      </Text>
      <Button title="Abmelden" onPress={logout} style={{marginTop: 24}} />
    </View>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarLabel: 'Suche',
          tabBarIcon: () => <Text style={{fontSize: 24}}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Buchungen',
          tabBarIcon: () => <Text style={{fontSize: 24}}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: () => <Text style={{fontSize: 24}}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  text: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
