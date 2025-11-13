# Phase 2 - Advanced Features Setup Script

echo "🚀 Installing Phase 2 Dependencies..."

# Navigate to web app directory
cd book-ax-web

# Install Testing Dependencies
echo "\n📦 Installing Jest & React Testing Library..."
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest

# Install Testing Library for Next.js
echo "\n📦 Installing Next.js Testing Utilities..."
npm install --save-dev @testing-library/react-hooks

echo "\n✅ All Phase 2 dependencies installed!"
echo "\n📝 You can now run tests with:"
echo "   npm test                 # Run all tests"
echo "   npm run test:watch       # Run tests in watch mode"
echo "   npm run test:coverage    # Run tests with coverage report"

echo "\n📊 To install Database Indexes:"
echo "   1. Open Supabase SQL Editor"
echo "   2. Run: database/performance-indexes.sql"
echo "   3. This will create all performance indexes"

echo "\n🎉 Phase 2 Setup Complete!"
