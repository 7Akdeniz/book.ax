const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const newTranslations = {
  panel: {
    calendar: {
      title: 'Calendar & Availability',
      subtitle: 'View bookings, check-ins, and occupancy in calendar view',
      loading: 'Loading calendar...',
      fetchError: 'Failed to load calendar data',
      today: 'Today',
      previous: 'Previous',
      next: 'Next',
      checkIn: 'Check-In',
      checkOut: 'Check-Out',
      checkIns: 'Check-Ins',
      checkOuts: 'Check-Outs',
      occupied: 'Occupied',
      more: 'more',
      bookings: 'Bookings',
      rooms: 'Rooms',
      noBookings: 'No bookings for this day',
      legend: 'Legend',
      accessDenied: 'Access denied. Hotelier account required.',
      stats: {
        bookings: 'Bookings',
        checkIns: 'Check-Ins',
        checkOuts: 'Check-Outs',
        occupancy: 'Avg. Occupancy',
        revenue: 'Revenue',
      },
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        checkedIn: 'Checked In',
        checkedOut: 'Checked Out',
        cancelled: 'Cancelled',
      },
    },
  },
};

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const languageFiles = fs.readdirSync(messagesDir).filter((file) => file.endsWith('.json'));

console.log(`Updating ${languageFiles.length} language files...`);

languageFiles.forEach((file) => {
  const filePath = path.join(messagesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  deepMerge(content, newTranslations);

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✓ Updated ${file}`);
});

console.log('\n✅ All language files updated with panel.calendar translations!');
console.log('�� Note: English translations used as placeholders for all languages.');
