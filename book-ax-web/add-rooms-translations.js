#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const roomsTranslations = {
  "title": "Room Categories",
  "subtitle": "Manage your room types and pricing",
  "loading": "Loading room categories...",
  "addRoom": "Add Room Category",
  "edit": "Edit",
  "delete": "Delete",
  "confirmDelete": "Are you sure you want to delete this room category?",
  "empty": {
    "title": "No Room Categories Yet",
    "description": "Add your first room category to start accepting bookings",
    "button": "Add First Room Category"
  },
  "card": {
    "basePrice": "Base Price",
    "maxOccupancy": "Max Occupancy",
    "totalRooms": "Total Rooms",
    "size": "Size",
    "amenities": "Amenities"
  },
  "modal": {
    "addTitle": "Add Room Category",
    "editTitle": "Edit Room Category",
    "name": "Room Category Name",
    "basePrice": "Base Price per Night",
    "maxOccupancy": "Max Occupancy",
    "totalRooms": "Number of Rooms",
    "size": "Room Size (m²)",
    "bedType": "Bed Type",
    "englishName": "English Name",
    "englishDescription": "English Description",
    "amenities": "Room Amenities",
    "cancel": "Cancel",
    "save": "Save Room Category",
    "saving": "Saving..."
  },
  "success": {
    "created": "Room category created successfully!",
    "updated": "Room category updated successfully!",
    "deleted": "Room category deleted successfully!"
  },
  "errors": {
    "loadFailed": "Failed to load room categories",
    "createFailed": "Failed to create room category",
    "updateFailed": "Failed to update room category",
    "deleteFailed": "Failed to delete room category"
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

    // Check if panel.hotels.rooms already exists
    if (translations.panel?.hotels?.rooms) {
      console.log(`⏭️  ${locale}: panel.hotels.rooms already exists`);
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

    // Add rooms translations
    translations.panel.hotels.rooms = roomsTranslations;

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf-8');
    console.log(`✅ ${locale}: Added panel.hotels.rooms translations`);
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
