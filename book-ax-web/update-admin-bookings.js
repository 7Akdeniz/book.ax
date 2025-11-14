const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

// Admin Bookings Translations
const adminBookingsTranslations = {
  admin: {
    bookings: {
      title: "All Bookings",
      subtitle: "Manage all bookings across all hotels",
      loading: "Loading bookings...",
      refresh: "Refresh",
      fetchError: "Failed to load bookings",
      confirmCancel: "Are you sure you want to cancel this booking?",
      cancelSuccess: "Booking cancelled successfully",
      cancelError: "Failed to cancel booking",
      noBookings: "No bookings found",
      stats: {
        total: "Total Bookings",
        confirmed: "Confirmed",
        pending: "Pending",
        revenue: "Total Revenue"
      },
      filters: {
        search: "Search",
        searchPlaceholder: "Search by reference, hotel, guest...",
        status: "Status",
        allStatuses: "All Statuses",
        source: "Source",
        allSources: "All Sources"
      },
      status: {
        pending: "Pending",
        confirmed: "Confirmed",
        checkedIn: "Checked In",
        checkedOut: "Checked Out",
        cancelled: "Cancelled",
        noShow: "No Show"
      },
      source: {
        direct: "Direct",
        bookingCom: "Booking.com",
        airbnb: "Airbnb",
        expedia: "Expedia",
        other: "Other"
      },
      table: {
        reference: "Reference",
        hotel: "Hotel",
        guest: "Guest",
        dates: "Dates",
        guests: "Guests / Rooms",
        amount: "Amount",
        status: "Status",
        source: "Source",
        actions: "Actions"
      },
      actions: {
        cancel: "Cancel"
      }
    }
  }
};

// Read all language files
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

console.log(`Updating ${files.length} language files...`);

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Merge admin.bookings
  if (!content.admin) content.admin = {};
  content.admin.bookings = adminBookingsTranslations.admin.bookings;
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`✓ Updated ${file}`);
});

console.log('\n✅ All files updated successfully!');
