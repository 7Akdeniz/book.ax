#!/bin/bash

echo "📦 Book.ax Vercel Deployment"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Fehler: vercel.json nicht gefunden!"
    echo "   Bitte im Root-Verzeichnis des Projekts ausführen."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLI nicht installiert. Installiere..."
    npm install -g vercel
fi

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Uncommitted changes gefunden!"
    echo ""
    read -p "Möchtest du die Änderungen committen? (j/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Jj]$ ]]; then
        git add .
        read -p "Commit message: " commit_msg
        git commit -m "$commit_msg"
    fi
fi

echo ""
echo "🚀 Deployment Optionen:"
echo "1) Auto-Deployment (Git Push)"
echo "2) Manuelles Deployment (Vercel CLI)"
echo "3) Preview Deployment"
echo ""
read -p "Wähle eine Option (1-3): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo "📤 Pushe zu GitHub..."
        git push origin main
        echo "✅ Gepushed! Vercel deployed automatisch."
        echo "📊 Check Status: https://vercel.com/7Akdeniz/book-ax/deployments"
        ;;
    2)
        echo "🚀 Starte Production Deployment..."
        vercel --prod
        ;;
    3)
        echo "🔍 Starte Preview Deployment..."
        vercel
        ;;
    *)
        echo "❌ Ungültige Option"
        exit 1
        ;;
esac

echo ""
echo "✅ Fertig!"
echo ""
echo "🌐 URLs:"
echo "   Production: https://book-ax.vercel.app"
echo "   Dashboard:  https://vercel.com/7Akdeniz/book-ax"
echo ""
