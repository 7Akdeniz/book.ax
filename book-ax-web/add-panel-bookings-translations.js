const fs = require('fs');
const path = require('path');

// Messages directory
const messagesDir = path.join(__dirname, 'messages');

// New translations to add
const newTranslations = {
  panel: {
    bookings: {
      title: 'Bookings Management',
      subtitle: 'Manage your hotel bookings, check-ins, and check-outs',
      loading: 'Loading bookings...',
      refresh: 'Refresh',
      fetchError: 'Failed to load bookings',
      noBookings: 'No bookings found',
      confirmCheckIn: 'Are you sure you want to check in this guest?',
      confirmCheckOut: 'Are you sure you want to check out this guest?',
      confirmCancel: 'Are you sure you want to cancel this booking?',
      checkInSuccess: 'Guest checked in successfully',
      checkInError: 'Failed to check in guest',
      checkOutSuccess: 'Guest checked out successfully',
      checkOutError: 'Failed to check out guest',
      cancelSuccess: 'Booking cancelled successfully',
      cancelError: 'Failed to cancel booking',
      stats: {
        total: 'Total Bookings',
        confirmed: 'Confirmed',
        todayCheckIns: "Today's Check-Ins",
        todayCheckOuts: "Today's Check-Outs",
        revenue: 'Total Revenue',
      },
      filters: {
        search: 'Search',
        searchPlaceholder: 'Search by reference, guest, or room...',
        status: 'Status',
        allStatuses: 'All Statuses',
        date: 'Date',
        allDates: 'All Dates',
        today: 'Today',
        upcoming: 'Upcoming',
        past: 'Past',
      },
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        checkedIn: 'Checked In',
        checkedOut: 'Checked Out',
        cancelled: 'Cancelled',
        noShow: 'No Show',
      },
      source: {
        direct: 'Direct',
        bookingCom: 'Booking.com',
        airbnb: 'Airbnb',
        expedia: 'Expedia',
        other: 'Other',
      },
      table: {
        reference: 'Reference',
        room: 'Room',
        guest: 'Guest',
        dates: 'Dates',
        guests: 'Guests / Rooms',
        amount: 'Amount',
        status: 'Status',
        source: 'Source',
        actions: 'Actions',
      },
      actions: {
        checkIn: 'Check In',
        checkOut: 'Check Out',
        cancel: 'Cancel',
        viewDetails: 'View Details',
      },
    },
  },
};

// Deep merge function
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      // Only add if key doesn't exist
      if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Get all language files
const languageFiles = fs.readdirSync(messagesDir).filter((file) => file.endsWith('.json'));

console.log(`Updating ${languageFiles.length} language files...`);

languageFiles.forEach((file) => {
  const filePath = path.join(messagesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Deep merge new translations
  deepMerge(content, newTranslations);

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✓ Updated ${file}`);
});

console.log('✅ All language files updated with panel.bookings translations!');
console.log('📝 Note: English translations used as placeholders for all languages.');
