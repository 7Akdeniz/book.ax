#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const calendarTranslations = {
  "title": "Calendar",
  "subtitle": "Manage your bookings and availability",
  "loading": "Loading calendar...",
  "today": "Today",
  "month": "Month",
  "week": "Week",
  "day": "Day",
  "months": {
    "january": "January",
    "february": "February",
    "march": "March",
    "april": "April",
    "may": "May",
    "june": "June",
    "july": "July",
    "august": "August",
    "september": "September",
    "october": "October",
    "november": "November",
    "december": "December"
  },
  "weekdays": {
    "sunday": "Sunday",
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday"
  },
  "weekdaysShort": {
    "sun": "Sun",
    "mon": "Mon",
    "tue": "Tue",
    "wed": "Wed",
    "thu": "Thu",
    "fri": "Fri",
    "sat": "Sat"
  },
  "bookings": {
    "checkIn": "Check-in",
    "checkOut": "Check-out",
    "inHouse": "In-house",
    "total": "Total Bookings",
    "viewDetails": "View Details"
  },
  "legend": {
    "title": "Legend",
    "checkIn": "Check-in",
    "checkOut": "Check-out",
    "occupied": "Occupied",
    "available": "Available"
  },
  "noBookings": "No bookings for this day",
  "errors": {
    "loadFailed": "Failed to load calendar data"
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

    // Check if panel.hotels.calendar already exists
    if (translations.panel?.hotels?.calendar) {
      console.log(`⏭️  ${locale}: panel.hotels.calendar already exists`);
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

    // Add calendar translations
    translations.panel.hotels.calendar = calendarTranslations;

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf-8');
    console.log(`✅ ${locale}: Added panel.hotels.calendar translations`);
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
