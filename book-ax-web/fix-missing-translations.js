const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

// Vollständige Übersetzungen für alle fehlenden Bereiche
const missingTranslations = {
  // Common Texte erweitern
  common: {
    welcome: "Welcome",
    yes: "Yes",
    no: "No",
    confirm: "Confirm",
    view: "View",
    download: "Download",
    export: "Export",
    import: "Import",
    refresh: "Refresh",
    filter: "Filter",
    sort: "Sort",
    actions: "Actions",
    details: "Details",
    status: "Status",
    date: "Date",
    time: "Time",
    name: "Name",
    description: "Description",
    settings: "Settings"
  },

  // Auth Texte erweitern
  auth: {
    login: "Login",
    logout: "Logout",
    register: "Register",
    email: "Email Address",
    password: "Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    rememberMe: "Remember Me",
    loginButton: "Login",
    registerButton: "Create Account",
    loginSuccess: "Login successful!",
    loginError: "Login failed. Please check your credentials.",
    logoutSuccess: "Logged out successfully",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    invalidEmail: "Invalid email address",
    passwordMinLength: "Password must be at least 8 characters",
    accountCreated: "Account created successfully!",
    registrationError: "Registration failed. Please try again.",
    passwordResetSent: "Password reset link sent to your email",
    passwordResetError: "Failed to send reset link",
    role: "Role",
    guest: "Guest",
    hotelier: "Hotelier",
    admin: "Administrator"
  },

  // Admin Texte ergänzen
  admin: {
    loginTitle: "Admin Login",
    loginSubtitle: "Sign in to access the admin panel",
    accessDenied: "Access Denied - Admin privileges required",
    unauthorized: "Unauthorized access",
    welcomeBack: "Welcome back, Administrator",
    navigation: {
      dashboard: "Dashboard",
      hotels: "Hotels",
      bookings: "Bookings",
      users: "Users",
      finances: "Finances",
      settings: "Settings",
      logout: "Logout"
    }
  },

  // Panel Texte ergänzen
  panel: {
    loginTitle: "Hotelier Login",
    loginSubtitle: "Sign in to manage your hotel",
    accessDenied: "Access Denied - Hotelier role required",
    unauthorized: "Unauthorized access",
    welcomeBack: "Welcome back",
    navigation: {
      dashboard: "Dashboard",
      bookings: "Bookings",
      calendar: "Calendar",
      rooms: "Rooms",
      rates: "Rates",
      guests: "Guests",
      reports: "Reports",
      settings: "Settings",
      logout: "Logout"
    }
  },

  // Help Texte hinzufügen (fehlende)
  help: {
    title: "Help Center",
    subtitle: "Find answers to your questions",
    searchPlaceholder: "Search for help...",
    contactSupport: "Contact Support",
    faq: "Frequently Asked Questions",
    guides: "User Guides",
    documentation: "Documentation"
  }
};

// Lese en.json und merge die fehlenden Übersetzungen
const enPath = path.join(messagesDir, 'en.json');
const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Deep merge function
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      if (!target[key]) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Merge missing translations into en.json
deepMerge(enContent, missingTranslations);

// Save updated en.json
fs.writeFileSync(enPath, JSON.stringify(enContent, null, 2) + '\n', 'utf8');
console.log('✓ Updated en.json with missing translations');

// Now propagate to all other languages
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json') && f !== 'en.json');

console.log(`\nUpdating ${files.length} other language files...`);

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Merge the same structure (English text as fallback)
  deepMerge(content, missingTranslations);
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`✓ Updated ${file}`);
});

console.log('\n✅ All files updated successfully!');
console.log('\n📝 Note: The translations are in English as placeholders.');
console.log('   You should translate them to the respective languages.');
