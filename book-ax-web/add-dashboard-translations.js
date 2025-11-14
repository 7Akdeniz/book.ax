#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const dashboardTranslations = {
  "title": "Dashboard",
  "welcome": "Welcome back",
  "loading": "Loading dashboard data...",
  "stats": {
    "occupancy": "Occupancy Rate",
    "revenue": "Total Revenue",
    "todayArrivals": "Today's Arrivals",
    "todayDepartures": "Today's Departures",
    "totalBookings": "Total Bookings",
    "averageRate": "Average Daily Rate"
  },
  "recentBookings": {
    "title": "Recent Bookings",
    "guest": "Guest",
    "room": "Room",
    "checkIn": "Check-in",
    "checkOut": "Check-out",
    "status": "Status",
    "total": "Total",
    "viewAll": "View All Bookings",
    "noBookings": "No bookings yet",
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "checked_in": "Checked In",
      "checked_out": "Checked Out",
      "cancelled": "Cancelled"
    }
  },
  "quickActions": {
    "title": "Quick Actions",
    "addRoom": "Add Room Category",
    "manageRooms": "Manage Rooms",
    "viewCalendar": "View Calendar",
    "manageRates": "Manage Rates",
    "viewBookings": "View Bookings",
    "editHotel": "Edit Hotel Info"
  },
  "errors": {
    "loadFailed": "Failed to load dashboard data"
  }
};

const files = fs.readdirSync(messagesDir).filter((f) => f.endsWith('.json'));

let successCount = 0;
let skippedCount = 0;
let errorCount = 0;

files.forEach((file) => {
  const locale = file.replace('.json', '');
  const filePath = path.join(messagesDir, file);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);

    // Check if panel.hotels.dashboard already exists
    if (translations.panel?.hotels?.dashboard) {
      console.log(`⏭️  ${locale}: panel.hotels.dashboard already exists`);
      skippedCount++;
      return;
    }

    // Ensure panel.hotels exists
    if (!translations.panel) {
      translations.panel = {};
    }
    if (!translations.panel.hotels) {
      translations.panel.hotels = {};
    }

    // Add dashboard translations
    translations.panel.hotels.dashboard = dashboardTranslations;

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf-8');
    console.log(`✅ ${locale}: Added panel.hotels.dashboard translations`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${locale}: Error -`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Success: ${successCount}`);
console.log(`⏭️  Skipped: ${skippedCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log('='.repeat(60));
