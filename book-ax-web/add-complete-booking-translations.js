#!/usr/bin/env node

/**
 * Script to add complete booking system translations to all 50 language files
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

// Base translations (English)
const bookingTranslations = {
  booking: {
    // Existing
    yourBooking: "Your Booking",
    bookingDetails: "Booking Details",
    guestDetails: "Guest Details",
    paymentDetails: "Payment Details",
    confirmBooking: "Confirm Booking",
    bookingConfirmed: "Booking Confirmed!",
    bookingReference: "Booking Reference",
    totalPrice: "Total Price",
    nights: "{count} nights",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    specialRequests: "Special Requests",
    paymentMethod: "Payment Method",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    termsAndConditions: "I agree to the Terms and Conditions",
    cancellationPolicy: "Cancellation Policy",
    
    // New additions
    bookYourStay: "Book Your Stay",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    rooms: "Rooms",
    room: "Room",
    roomType: "Room Type",
    perNight: "per night",
    selectDates: "Please select check-in and check-out dates",
    invalidDateRange: "Invalid date range",
    loginRequired: "Please login to make a booking",
    availabilityCheckFailed: "Failed to check availability",
    available: "Available",
    notAvailable: "Not available",
    roomsLeft: "rooms left",
    checkingAvailability: "Checking availability...",
    bookNow: "Book Now",
    processing: "Processing...",
    taxes: "Taxes & Fees",
    total: "Total",
    freeCancel24h: "Free cancellation within 24 hours",
    reviewDetails: "Please review your booking details",
    guestInformation: "Guest Information",
    optional: "optional",
    specialRequestsPlaceholder: "Any special requests? (e.g. early check-in, extra bed)",
    fillAllFields: "Please fill in all required fields",
    bookingCreated: "Booking created successfully",
    bookingFailed: "Failed to create booking",
    proceedToPayment: "Proceed to Payment",
    bookingSummary: "Booking Summary",
    loading: "Loading...",
    dataNotFound: "Data not found",
    guestsCount: "guests",
    reference: "Reference",
    booked: "Booked on",
    viewDetails: "View Details",
    
    // Status translations
    status: {
      pending: "Pending",
      confirmed: "Confirmed",
      checked_in: "Checked In",
      checked_out: "Checked Out",
      cancelled: "Cancelled",
      no_show: "No Show"
    }
  },
  
  bookings: {
    title: "My Bookings",
    subtitle: "View and manage your hotel bookings",
    loading: "Loading bookings...",
    loadError: "Failed to load bookings",
    noBookings: "No bookings yet",
    noBookingsDescription: "You haven't made any bookings yet. Start exploring!",
    browseHotels: "Browse Hotels",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    guestsCount: "guests",
    room: "room",
    rooms: "rooms",
    reference: "Reference",
    booked: "Booked",
    totalPrice: "Total",
    viewDetails: "View Details",
    
    filters: {
      all: "All Bookings",
      upcoming: "Upcoming",
      past: "Past",
      cancelled: "Cancelled"
    },
    
    status: {
      pending: "Pending",
      confirmed: "Confirmed",
      checked_in: "Checked In",
      checked_out: "Checked Out",
      cancelled: "Cancelled",
      no_show: "No Show"
    }
  }
};

// Panel bookings translations
const panelBookingsTranslations = {
  panel: {
    bookings: {
      title: "Bookings Management",
      subtitle: "View and manage all hotel bookings",
      loading: "Loading bookings...",
      loadError: "Failed to load bookings",
      noBookings: "No bookings found",
      noBookingsDescription: "No bookings match your filters",
      statusUpdated: "Booking status updated successfully",
      statusUpdateError: "Failed to update booking status",
      
      stats: {
        total: "Total Bookings",
        pending: "Pending",
        confirmed: "Confirmed",
        checkedIn: "Checked In",
        revenue: "Total Payout"
      },
      
      filters: {
        date: "Date Range",
        allDates: "All Dates",
        today: "Today",
        upcoming: "Upcoming",
        past: "Past",
        status: "Status",
        allStatuses: "All Statuses",
        reset: "Reset Filters"
      },
      
      table: {
        reference: "Reference",
        guest: "Guest",
        room: "Room",
        dates: "Dates",
        amount: "Amount",
        status: "Status",
        actions: "Actions"
      },
      
      status: {
        pending: "Pending",
        confirmed: "Confirmed",
        checked_in: "Checked In",
        checked_out: "Checked Out",
        cancelled: "Cancelled",
        no_show: "No Show"
      },
      
      room: "room",
      rooms: "rooms",
      guests: "guests",
      commission: "Commission"
    }
  }
};

// German translations
const germanTranslations = {
  booking: {
    bookYourStay: "Buchen Sie Ihren Aufenthalt",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Gäste",
    rooms: "Zimmer",
    room: "Zimmer",
    roomType: "Zimmertyp",
    perNight: "pro Nacht",
    selectDates: "Bitte wählen Sie Check-in und Check-out Daten",
    invalidDateRange: "Ungültiger Datumsbereich",
    loginRequired: "Bitte melden Sie sich an, um zu buchen",
    availabilityCheckFailed: "Verfügbarkeitsprüfung fehlgeschlagen",
    available: "Verfügbar",
    notAvailable: "Nicht verfügbar",
    roomsLeft: "Zimmer verfügbar",
    checkingAvailability: "Verfügbarkeit wird geprüft...",
    bookNow: "Jetzt buchen",
    processing: "Wird verarbeitet...",
    taxes: "Steuern & Gebühren",
    total: "Gesamt",
    freeCancel24h: "Kostenlose Stornierung innerhalb von 24 Stunden",
    reviewDetails: "Bitte überprüfen Sie Ihre Buchungsdetails",
    guestInformation: "Gästeinformationen",
    optional: "optional",
    specialRequestsPlaceholder: "Besondere Wünsche? (z.B. früher Check-in, Extrabett)",
    fillAllFields: "Bitte füllen Sie alle Pflichtfelder aus",
    bookingCreated: "Buchung erfolgreich erstellt",
    bookingFailed: "Buchung fehlgeschlagen",
    proceedToPayment: "Zur Zahlung",
    bookingSummary: "Buchungsübersicht",
    loading: "Lädt...",
    dataNotFound: "Daten nicht gefunden",
    guestsCount: "Gäste",
    reference: "Referenz",
    booked: "Gebucht am",
    viewDetails: "Details anzeigen"
  },
  
  bookings: {
    title: "Meine Buchungen",
    subtitle: "Ihre Hotelbuchungen verwalten",
    loading: "Buchungen werden geladen...",
    loadError: "Fehler beim Laden der Buchungen",
    noBookings: "Noch keine Buchungen",
    noBookingsDescription: "Sie haben noch keine Buchungen. Jetzt entdecken!",
    browseHotels: "Hotels durchsuchen",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Gäste",
    guestsCount: "Gäste",
    room: "Zimmer",
    rooms: "Zimmer",
    reference: "Referenz",
    booked: "Gebucht",
    totalPrice: "Gesamt",
    viewDetails: "Details anzeigen",
    
    filters: {
      all: "Alle Buchungen",
      upcoming: "Bevorstehend",
      past: "Vergangen",
      cancelled: "Storniert"
    }
  }
};

console.log('Adding booking translations to all language files...\n');

// Get all JSON files in messages directory
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const locale = file.replace('.json', '');
  
  try {
    // Read existing translations
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);
    
    // For German, use German translations, otherwise use English
    const newTranslations = locale === 'de' ? germanTranslations : bookingTranslations;
    
    // Merge booking translations
    if (!translations.booking) {
      translations.booking = {};
    }
    Object.assign(translations.booking, newTranslations.booking || bookingTranslations.booking);
    
    // Merge bookings translations
    if (!translations.bookings) {
      translations.bookings = {};
    }
    Object.assign(translations.bookings, newTranslations.bookings || bookingTranslations.bookings);
    
    // Merge panel.bookings translations
    if (!translations.panel) {
      translations.panel = {};
    }
    if (!translations.panel.bookings) {
      translations.panel.bookings = {};
    }
    Object.assign(translations.panel.bookings, panelBookingsTranslations.panel.bookings);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf-8');
    console.log(`✓ Updated ${file}`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log('\n✅ Booking translations added to all language files!');
console.log('⚠️  Note: Only English and German have full translations.');
console.log('   Other languages use English as fallback.');
console.log('   Use a professional translation service for production.\n');
