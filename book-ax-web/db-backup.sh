#!/bin/bash

# 💾 Datenbank Backup erstellen

BACKUP_DIR="./database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/bookax_backup_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "📦 Erstelle Backup..."
docker exec -t bookax-postgres pg_dump -U bookax_user bookax > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    FILESIZE=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)
    echo "✅ Backup erfolgreich erstellt: $BACKUP_FILE"
    echo "   Größe: $((FILESIZE / 1024)) KB"
else
    echo "❌ Backup fehlgeschlagen!"
    exit 1
fi
