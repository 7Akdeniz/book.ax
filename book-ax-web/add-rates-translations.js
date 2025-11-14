#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const ratesTranslations = {
  "title": "Rates & Availability",
  "subtitle": "Manage pricing and inventory for your rooms",
  "loading": "Loading rates data...",
  "selectRoom": "Select Room Category",
  "allRooms": "All Room Categories",
  "dateRange": "Date Range",
  "startDate": "Start Date",
  "endDate": "End Date",
  "basePrice": "Base Price",
  "availability": "Availability",
  "available": "Available",
  "unavailable": "Unavailable",
  "updateRates": "Update Rates",
  "bulkUpdate": "Bulk Update",
  "applyToRange": "Apply to Date Range",
  "price": {
    "title": "Price Management",
    "current": "Current Price",
    "new": "New Price",
    "increase": "Increase by",
    "decrease": "Decrease by",
    "percentage": "Percentage",
    "amount": "Amount"
  },
  "inventory": {
    "title": "Inventory Control",
    "totalRooms": "Total Rooms",
    "availableRooms": "Available Rooms",
    "blockedRooms": "Blocked Rooms",
    "block": "Block Rooms",
    "unblock": "Unblock Rooms"
  },
  "presets": {
    "title": "Quick Presets",
    "weekend": "Weekend Rate (+20%)",
    "peak": "Peak Season (+50%)",
    "lowSeason": "Low Season (-20%)",
    "lastMinute": "Last Minute (-30%)"
  },
  "calendar": {
    "title": "Rate Calendar",
    "today": "Today",
    "selectDate": "Select date to edit rates"
  },
  "form": {
    "pricePerNight": "Price per Night",
    "availableRooms": "Available Rooms",
    "minStay": "Minimum Stay (nights)",
    "maxStay": "Maximum Stay (nights)",
    "closedToArrival": "Closed to Arrival",
    "closedToDeparture": "Closed to Departure",
    "save": "Save Changes",
    "saving": "Saving...",
    "cancel": "Cancel"
  },
  "success": {
    "updated": "Rates updated successfully!",
    "bulkUpdated": "Bulk rates updated successfully!"
  },
  "errors": {
    "loadFailed": "Failed to load rates data",
    "updateFailed": "Failed to update rates",
    "invalidPrice": "Invalid price - must be greater than 0",
    "invalidAvailability": "Invalid availability - cannot exceed total rooms",
    "invalidDateRange": "Invalid date range - end date must be after start date",
    "unauthorized": "Unauthorized - you don't have permission to modify rates",
    "forbidden": "Access denied - only hotel owners can modify rates",
    "sessionExpired": "Session expired - please login again"
  },
  "warnings": {
    "priceChange": "This will change prices for {count} days",
    "blockAvailability": "This will block availability and may affect existing bookings",
    "confirm": "Are you sure you want to continue?"
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

    if (translations.panel?.hotels?.rates) {
      console.log(`⏭️  ${locale}: panel.hotels.rates already exists`);
      skippedCount++;
      return;
    }

    if (!translations.panel) {
      translations.panel = {};
    }
    if (!translations.panel.hotels) {
      translations.panel.hotels = {};
    }

    translations.panel.hotels.rates = ratesTranslations;

    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf-8');
    console.log(`✅ ${locale}: Added panel.hotels.rates translations`);
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
