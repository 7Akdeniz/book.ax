#!/usr/bin/env node

/**
 * Add Panel Translations for Hotel Onboarding Form
 * Adds translations to all 50 language files
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

// Base translations in English
const panelTranslations = {
  panel: {
    hotels: {
      new: {
        title: 'Register New Hotel',
        subtitle: 'Complete the registration in 5 easy steps',
        steps: {
          basic: 'Basic Info',
          address: 'Address',
          translations: 'Translations',
          images: 'Images',
          review: 'Review',
        },
        basic: {
          title: 'Basic Information',
          subtitle: 'Tell us about your property',
          propertyType: {
            label: 'Property Type',
          },
          name: {
            label: 'Hotel Name',
            placeholder: 'e.g., Grand Hotel Berlin',
            hint: 'Official name as it appears on documents',
          },
          starRating: {
            label: 'Star Rating',
          },
          checkInTime: {
            label: 'Check-in Time',
          },
          checkOutTime: {
            label: 'Check-out Time',
          },
          totalRooms: {
            label: 'Total Rooms',
            hint: 'Number of available rooms',
          },
          commission: {
            label: 'Commission Percentage',
            hint: 'Commission per booking (min. 10%, max. 50%)',
            info: 'Lower commission means higher visibility in search results!',
          },
          errors: {
            nameRequired: 'Hotel name is required (min. 3 characters)',
            totalRoomsInvalid: 'Total rooms must be between 1 and 1000',
            commissionInvalid: 'Commission must be between 10% and 50%',
          },
          nextButton: 'Next Step',
        },
        address: {
          title: 'Address & Contact',
          subtitle: 'Where is your property located?',
          addressLine1: {
            label: 'Address Line 1',
            placeholder: 'Street name and number',
          },
          addressLine2: {
            label: 'Address Line 2',
            placeholder: 'Apartment, suite, unit, building, floor, etc.',
          },
          city: {
            label: 'City',
            placeholder: 'e.g., Berlin',
          },
          state: {
            label: 'State/Province',
            placeholder: 'Optional',
          },
          postalCode: {
            label: 'Postal Code',
            placeholder: 'e.g., 10115',
          },
          country: {
            label: 'Country',
          },
          contactInfo: {
            title: 'Contact Information',
          },
          phone: {
            label: 'Phone Number',
            placeholder: '+49 30 12345678',
          },
          email: {
            label: 'Email Address',
            placeholder: 'info@hotel.com',
          },
          website: {
            label: 'Website',
            placeholder: 'https://hotel.com',
          },
          coordinates: {
            title: 'Coordinates (Optional)',
            subtitle: 'For accurate map placement',
          },
          latitude: {
            label: 'Latitude',
          },
          longitude: {
            label: 'Longitude',
          },
          errors: {
            addressRequired: 'Address is required (min. 5 characters)',
            cityRequired: 'City is required',
            postalCodeRequired: 'Postal code is required',
            phoneInvalid: 'Phone number must be at least 8 characters',
            emailInvalid: 'Valid email address is required',
            websiteInvalid: 'Website must start with http:// or https://',
          },
          backButton: 'Back',
          nextButton: 'Next Step',
        },
        translations: {
          title: 'Multi-Language Content',
          subtitle: 'Add translations for international guests',
          selectLanguage: 'Select Language',
          languagesCompleted: 'languages completed',
          required: 'Required',
          name: {
            label: 'Hotel Name',
            placeholder: 'Translated hotel name',
          },
          description: {
            label: 'Description',
            placeholder: 'Describe your hotel, facilities, and what makes it special...',
          },
          checkIn: {
            label: 'Check-in Instructions',
            placeholder: 'How guests can check in, where to find reception, etc.',
          },
          checkOut: {
            label: 'Check-out Instructions',
            placeholder: 'Check-out process, key return, late check-out options, etc.',
          },
          houseRules: {
            label: 'House Rules',
            placeholder: 'Smoking policy, pets, noise restrictions, etc.',
          },
          errors: {
            englishRequired: 'English translation is required (Name and Description)',
          },
          info: 'English is required. Add more languages to reach international guests!',
          backButton: 'Back',
          nextButton: 'Next Step',
        },
        images: {
          title: 'Hotel Images',
          subtitle: 'Add photos to showcase your property',
          selectFiles: 'Select Images',
          dragDropHint: 'or drag and drop images here',
          maxSize: 'Max 5MB per image • JPEG, PNG, WebP',
          uploading: 'Uploading...',
          uploadedImages: 'Uploaded Images',
          primary: 'Primary',
          makePrimary: 'Make Primary',
          remove: 'Remove',
          errors: {
            invalidFileType: 'Only image files are allowed (JPEG, PNG, WebP)',
            fileTooLarge: 'File is too large (max 5MB)',
            uploadFailed: 'Upload failed. Please try again.',
            noImages: 'Please upload at least one image',
          },
          info: 'First image will be the primary image. You can change this later.',
          backButton: 'Back',
          nextButton: 'Next Step',
        },
        review: {
          title: 'Review & Submit',
          subtitle: 'Please review all information before submitting',
          sections: {
            basic: 'Basic Information',
            address: 'Address & Contact',
            translations: 'Translations',
            images: 'Images',
          },
          fields: {
            name: 'Hotel Name',
            starRating: 'Star Rating',
            totalRooms: 'Total Rooms',
            commission: 'Commission',
            checkIn: 'Check-in',
            checkOut: 'Check-out',
            phone: 'Phone',
            email: 'Email',
            website: 'Website',
          },
          noImages: 'No images uploaded',
          warning: 'Your hotel will be submitted for review. Our team will verify the information within 24-48 hours.',
          backButton: 'Back',
          submitButton: 'Submit Hotel',
          submitting: 'Submitting...',
          success: 'Hotel registered successfully! Redirecting...',
          error: 'Failed to register hotel. Please try again.',
        },
      },
    },
  },
};

// Get all language files
const languageFiles = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));

console.log(`📝 Adding panel translations to ${languageFiles.length} language files...`);

let successCount = 0;
let errorCount = 0;

languageFiles.forEach(file => {
  try {
    const filePath = path.join(messagesDir, file);
    const locale = file.replace('.json', '');
    
    // Read existing translations
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    // Add hotels.new to panel translations
    if (!translations.panel) {
      translations.panel = {};
    }
    
    if (!translations.panel.hotels) {
      translations.panel.hotels = panelTranslations.panel.hotels;
      
      // Write back
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf8');
      
      console.log(`✅ ${locale}: Added panel.hotels translations`);
      successCount++;
    } else {
      console.log(`⏭️  ${locale}: Panel.hotels translations already exist`);
    }
  } catch (error) {
    console.error(`❌ ${file}: Error - ${error.message}`);
    errorCount++;
  }
});

console.log(`\n✨ Done!`);
console.log(`   Success: ${successCount}`);
console.log(`   Skipped: ${languageFiles.length - successCount - errorCount}`);
console.log(`   Errors: ${errorCount}`);
