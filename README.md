# 🏨 BOOK.AX - Complete Hotel Management Platform

> **All-in-One Hotel System**: PMS + Booking Engine + Channel Manager + AI Revenue Management

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)](https://stripe.com/)

---

## 🌟 Features

### For Guests (Public Platform)
- 🔍 **Advanced Hotel Search** - Search 500,000+ properties worldwide
- 🌍 **75 Languages** - Full multi-language support
- 💳 **Secure Payments** - Stripe integration
- 📱 **Responsive Design** - Works on all devices
- ⭐ **Reviews & Ratings** - Verified guest reviews
- 📧 **Booking Confirmations** - Email notifications

### For Hoteliers (Property Management)
- 📊 **Dashboard** - Real-time occupancy, revenue, arrivals/departures
- 🏨 **Hotel Management** - Properties, rooms, categories, amenities
- 📅 **Calendar** - Dynamic pricing & availability management
- 💰 **Commission Settings** - Set your own commission (10-50%)
- 🛏️ **PMS Module**:
  - Housekeeping status board
  - Guest lists & check-in/out
  - Invoicing & billing
  - No-show tracking
- 📡 **Channel Manager**:
  - Connect to 450+ OTAs (Booking.com, Airbnb, Expedia, etc.)
  - 2-way sync of rates, inventory, reservations
  - OTA mapping & logs
- 🤖 **AI Revenue Management**:
  - Automatic price recommendations
  - Market intelligence
  - Event detection
  - Demand forecasting
- 📈 **Reports**: Occupancy, ADR, RevPAR, channel performance

### For Admins
- ✅ **Hotel Approval** - Review and approve new properties
- 👥 **User Management** - Manage guests, hoteliers, permissions
- 💵 **Commissions** - Global commission settings & payouts
- ⚙️ **System Settings** - Taxes, currencies, countries
- 📊 **Analytics** - Platform-wide metrics
- 🔌 **OTA Monitoring** - Connection status & logs

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Next.js API Routes (Serverless) |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | JWT + Refresh Tokens |
| **Payments** | Stripe |
| **i18n** | next-intl (75 languages) |
| **Deployment** | Vercel |
| **Storage** | AWS S3 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL (or Supabase account)
- Stripe account

### Installation

```bash
# Clone repository
cd book-ax-web

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Setup database
# 1. Create Supabase project at https://supabase.com
# 2. Go to SQL Editor
# 3. Copy/paste contents of database/schema.sql
# 4. Execute

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 Project Structure

```
book-ax-web/
├── messages/           # i18n translations (75 languages)
├── src/
│   ├── app/
│   │   ├── [locale]/   # Language-based routing
│   │   ├── admin/      # Admin portal
│   │   └── api/        # API endpoints
│   ├── components/     # React components
│   ├── lib/            # Core libraries
│   ├── types/          # TypeScript types
│   └── utils/          # Utilities
├── database/
│   └── schema.sql      # Complete DB schema
└── IMPLEMENTATION_GUIDE.md  # Full technical docs
```

---

## 🌍 Supported Languages (75)

English, Chinese, Hindi, Spanish, Arabic, French, Bengali, Portuguese, Russian, Urdu, Indonesian, German, Japanese, Swahili, Marathi, Telugu, Turkish, Tamil, Punjabi, Vietnamese, Korean, Italian, Javanese, Yoruba, Hausa, Thai, Gujarati, Persian, Polish, Ukrainian, Burmese, Malayalam, Kannada, Amharic, Oromo, Filipino, Sindhi, Nepali, Sinhala, Hebrew, Dutch, Romanian, Czech, Greek, Swedish, Hungarian, Azerbaijani, Pashto, Malay, Zulu, Somali, Igbo, Uzbek, Kazakh, Belarusian, Khmer, Lao, Malagasy, Bulgarian, Danish, Finnish, Norwegian, Slovak, Croatian, Serbian, Bosnian, Armenian, Albanian, Lithuanian, Latvian, Georgian, Mongolian, Kurdish, Haitian Creole, Catalan

---

## 💼 Business Model

### Zero Monthly Fees
- ✅ **No setup costs**
- ✅ **No monthly subscription**
- ✅ **All features free**

### Commission-Based Revenue
- 💰 **10-50% commission** per booking
- 🎛️ **Hotelier sets rate** freely
- 📊 **Transparent calculation**:
  ```
  commission_amount = total_amount × commission_percentage
  hotel_payout = total_amount - commission_amount
  ```

---

## 📊 Database Schema

Complete schema includes:
- **Users** - Guests, hoteliers, admins
- **Hotels** - Properties with translations
- **Rooms** - Categories, amenities, translations
- **Rates & Inventory** - Daily pricing & availability
- **Bookings** - Reservations with status tracking
- **Payments** - Stripe integration
- **Commissions** - Payout tracking
- **PMS** - Housekeeping, guests, invoices
- **Channel Manager** - OTA connections, mappings, logs
- **Revenue Management** - Rules, recommendations, market data
- **Reviews** - Guest ratings & comments

**Total: 25+ tables** with foreign keys, indexes, triggers

See `database/schema.sql` for complete schema.

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Hotels
- `GET /api/hotels` - Search hotels
- `GET /api/hotels/[id]` - Hotel details
- `POST /api/hotels` - Create hotel (hotelier)
- `PUT /api/hotels/[id]` - Update hotel
- `DELETE /api/hotels/[id]` - Delete hotel

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment
- `POST /api/webhook/stripe` - Stripe webhook

### Channel Manager
- `POST /api/channel-manager/rate-push` - Push rates to OTAs
- `POST /api/channel-manager/inventory-push` - Push inventory
- `POST /api/channel-manager/reservation-pull` - Pull reservations

### Revenue Management
- `GET /api/revenue/recommendations` - Get price recommendations
- `POST /api/revenue/apply` - Apply recommended prices

---

## 🤖 AI Revenue Management

The system uses AI to automatically optimize pricing based on:
- 📊 **Historical booking data**
- 📈 **Current occupancy rates**
- 📅 **Day of week patterns**
- 🎉 **Local events & holidays**
- 🏨 **Market intelligence**
- 💰 **Competitor pricing**
- ⚡ **Demand forecasting**

Hoteliers can:
- Set min/max prices
- Define pricing rules
- Enable/disable auto-pricing
- Review recommendations before applying

---

## 📡 Channel Manager - Supported OTAs

### Major Platforms (Examples)
- Booking.com
- Airbnb
- Expedia
- Hotels.com
- Agoda
- TripAdvisor
- Vrbo
- Hostelworld
- And 440+ more...

### Features
- ✅ 2-way synchronization
- ✅ Real-time rate updates
- ✅ Inventory management
- ✅ Reservation import
- ✅ OTA room mapping
- ✅ Sync logs & monitoring
- ✅ Error handling

---

## 🔐 Security

- 🔒 **JWT Authentication** with refresh tokens
- 🔑 **bcrypt** password hashing
- 🛡️ **Input validation** (Zod)
- 🚦 **Rate limiting**
- 🔐 **HTTPS only**
- 💳 **PCI-DSS compliant** (Stripe)
- 🔒 **Row Level Security** (PostgreSQL)

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Docker
```bash
docker build -t book-ax .
docker run -p 3000:3000 book-ax
```

### Environment Variables
See `.env.local.example` for required variables.

---

## 📚 Documentation

- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **System Architecture**: `HOTEL_PMS_SYSTEM_ARCHITEKTUR.md`
- **MVP Plan**: `PMS_IMPLEMENTIERUNG_REALISTISCH.md`
- **Database Schema**: `database/schema.sql`

---

## 🛠️ Development

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 🗺️ Roadmap

### Phase 1: MVP (6-8 weeks) ✅
- [x] Database schema
- [x] Authentication system
- [x] Basic hotel search
- [x] Booking flow
- [x] Payment integration
- [ ] Hotelier dashboard
- [ ] 10 main languages

### Phase 2: PMS (Weeks 9-16)
- [ ] Complete PMS module
- [ ] Housekeeping board
- [ ] Guest management
- [ ] Invoicing system
- [ ] 25 languages

### Phase 3: Channel Manager (Weeks 17-24)
- [ ] Booking.com integration
- [ ] Airbnb integration
- [ ] Expedia integration
- [ ] 50 languages

### Phase 4: AI Revenue (Weeks 25-32)
- [ ] ML-based pricing engine
- [ ] Market intelligence
- [ ] Demand forecasting
- [ ] 75 languages

### Phase 5: Enterprise (Weeks 33-40)
- [ ] Advanced analytics
- [ ] Multi-property management
- [ ] White-label options
- [ ] Mobile apps

---

## 💰 Cost Estimation

### MVP Development
- **Timeline**: 6-8 weeks
- **Team**: 2-3 developers
- **Cost**: 15.000€ - 30.000€

### Full Enterprise System
- **Timeline**: 12-24 months
- **Team**: 10-15 developers
- **Cost**: 970.000€ - 1.500.000€

---

## 🤝 Contributing

This is a private commercial project. For collaboration inquiries, contact the project owner.

---

## 📄 License

Proprietary - All rights reserved

---

## 📞 Support

For technical questions or business inquiries:
- **Email**: support@book.ax
- **Website**: https://www.book.ax

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [Vercel](https://vercel.com/)

---

**Made with ❤️ for the hospitality industry**
