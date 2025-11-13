const fs = require('fs');
const path = require('path');

// Alle 50 Sprachen
const languages = [
  'en', 'zh', 'hi', 'es', 'ar', 'fr', 'tr', 'ru',
  'am', 'az', 'bn', 'my', 'ceb', 'cs', 'nl', 'fil', 'el', 'gu', 'he',
  'ha', 'id', 'it', 'ja', 'jv', 'kn', 'ko', 'ms', 'ml', 'mr', 'ne',
  'om', 'fa', 'pl', 'pa', 'ro', 'sr', 'sd', 'si', 'so', 'sw', 'ta',
  'te', 'th', 'uk', 'ur', 'vi', 'yo', 'zu', 'pt'
];

// Terms-Übersetzungen
const termsTranslations = {
  en: {
    metaDescription: "Terms and Conditions of Book.ax - Your Hotel Booking Platform",
    title: "Terms and Conditions",
    lastUpdated: "Last Updated: November 13, 2025",
    section1: {
      title: "1. Scope of Application",
      intro: "These Terms and Conditions govern the use of the Book.ax booking platform and regulate the contractual relationship between:",
      party1: "Book.ax (hereinafter \"we\" or \"Platform\")",
      party2: "Hoteliers and accommodation providers (hereinafter \"Partners\")",
      party3: "Guests and bookers (hereinafter \"Users\" or \"You\")"
    },
    section2: {
      title: "2. Service Description",
      intro: "Book.ax is an online booking platform for hotels and accommodations. We offer:",
      service1: "Brokerage of hotel rooms and accommodations",
      service2: "Secure online booking and payment processing",
      service3: "Management tools for hoteliers (Hotelier Dashboard)",
      service4: "Multilingual platform (50+ languages)",
      service5: "Customer service and support",
      note: "Book.ax acts as an intermediary between hotels and guests. The actual accommodation contract is concluded between guest and hotel."
    },
    section3: {
      title: "3. Booking Process",
      guests: {
        title: "3.1 For Guests",
        rule1: "Selecting a hotel constitutes a binding offer",
        rule2: "Booking confirmation is sent by email",
        rule3: "The prices stated at the time of booking apply",
        rule4: "Cancellation conditions vary by hotel"
      },
      hoteliers: {
        title: "3.2 For Hoteliers",
        rule1: "Partners commit to keeping room availability up to date",
        rule2: "Booking confirmations must be made within 24 hours",
        rule3: "False information may result in suspension"
      }
    },
    section4: {
      title: "4. Prices and Payment",
      intro: "All prices are stated in Euro (€) and include statutory VAT, unless otherwise stated.",
      payment: {
        title: "4.1 Payment Methods",
        method1: "Credit Card (Visa, Mastercard, American Express)",
        method2: "PayPal",
        method3: "SEPA Direct Debit",
        method4: "Payment on-site (depending on hotel)"
      },
      commission: {
        title: "4.2 Commission",
        text: "Book.ax charges a commission of 10-50% (depending on agreement) on successful bookings. The commission is automatically deducted from the booking amount."
      }
    },
    section5: {
      title: "5. Cancellation and Refund",
      intro: "Cancellation conditions are set by the respective hotel and can be viewed before booking.",
      rulesTitle: "Typical Rules:",
      rule1: "Free cancellation: Up to X days before arrival",
      rule2: "Partial refund: For cancellation within the deadline",
      rule3: "No refund: For no-show or cancellation on arrival day",
      refund: "Refunds are made to the original payment method within 5-10 business days."
    },
    section6: {
      title: "6. User Behavior and Obligations",
      prohibited: {
        title: "6.1 Prohibited Activities",
        activity1: "Misuse of the platform for illegal purposes",
        activity2: "False or misleading information",
        activity3: "Manipulation of reviews",
        activity4: "Violation of applicable laws"
      },
      consequences: {
        title: "6.2 Consequences",
        intro: "In case of violations of these Terms and Conditions, we reserve the right to:",
        consequence1: "Cancel bookings",
        consequence2: "Block user accounts",
        consequence3: "Claim damages",
        consequence4: "Initiate legal proceedings"
      }
    },
    section7: {
      title: "7. Liability",
      intro: "Book.ax is only liable for brokerage between hotel and guest. The respective hotel is responsible for actual service provision (accommodation, service, etc.).",
      disclaimerTitle: "Disclaimer:",
      disclaimer1: "No liability for incorrect hotel information",
      disclaimer2: "No liability for damage during stay",
      disclaimer3: "No liability for technical failures (Force Majeure)",
      note: "Liability for intentional or grossly negligent breaches of duty remains unaffected."
    },
    section8: {
      title: "8. Data Protection",
      intro: "The protection of your personal data is important to us. Detailed information can be found in our",
      privacyLink: "Privacy Policy",
      note: "We process your data exclusively within the framework of GDPR and applicable data protection laws."
    },
    section9: {
      title: "9. Changes to the Terms and Conditions",
      text1: "We reserve the right to change these Terms and Conditions at any time. Changes will be published on the website 30 days before they take effect.",
      text2: "Registered users will be informed by email of significant changes."
    },
    section10: {
      title: "10. Dispute Resolution and Applicable Law",
      law: {
        title: "10.1 Applicable Law",
        text: "The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods."
      },
      jurisdiction: {
        title: "10.2 Jurisdiction",
        text: "The place of jurisdiction for all disputes is, as far as legally permissible, the registered office of Book.ax."
      },
      odr: {
        title: "10.3 Online Dispute Resolution",
        intro: "The European Commission provides a platform for online dispute resolution (ODR):"
      }
    },
    section11: {
      title: "11. Severability Clause",
      text: "Should individual provisions of these Terms and Conditions be or become invalid, the validity of the remaining provisions shall remain unaffected."
    },
    section12: {
      title: "12. Contact",
      intro: "If you have questions about these Terms and Conditions or our services, please contact us:",
      company: "Book.ax",
      address1: "3171 Burnham Ave",
      address2: "Las Vegas, NV 89169, USA",
      email: "Email: i@book.ax"
    },
    footer: "By using Book.ax, you agree to these Terms and Conditions."
  }
};

console.log('🌍 Aktualisiere Terms-Übersetzungen für alle Sprachen...\n');

// Deutsche Version lesen
const dePath = path.join(__dirname, 'messages', 'de.json');
const deData = JSON.parse(fs.readFileSync(dePath, 'utf-8'));

// Prüfen ob Terms vorhanden ist
if (!deData.terms) {
  console.log('❌ Keine Terms in de.json gefunden!');
  process.exit(1);
}

console.log('✅ Deutsche Terms gefunden\n');

// Für jede Sprache
let updatedCount = 0;
for (const lang of languages) {
  const langPath = path.join(__dirname, 'messages', `${lang}.json`);
  
  try {
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    
    // Englisch direkt kopieren
    if (lang === 'en') {
      langData.terms = termsTranslations.en;
    } else {
      // Für andere Sprachen: Wenn nicht vorhanden, verwende englische Version
      if (!langData.terms) {
        langData.terms = termsTranslations.en;
      }
    }
    
    // Schreiben
    fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf-8');
    console.log(`✅ ${lang}.json - Terms hinzugefügt`);
    updatedCount++;
  } catch (error) {
    console.log(`❌ ${lang}.json - Fehler: ${error.message}`);
  }
}

console.log(`\n============================================================`);
console.log(`✨ ${updatedCount}/${languages.length} Sprachen aktualisiert!`);
console.log(`============================================================\n`);
console.log(`🎉 Terms-Übersetzungen hinzugefügt!`);
console.log(`📝 Hinweis: Englisch wurde manuell übersetzt, alle anderen verwenden vorerst die englische Version.`);
console.log(`💡 Für professionelle Übersetzungen empfehlen wir einen Übersetzungsdienst.`);
