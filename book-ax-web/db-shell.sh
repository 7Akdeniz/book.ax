#!/bin/bash

# 🗄️ PostgreSQL Shell öffnen
# Zugriff auf die lokale Docker PostgreSQL-Datenbank

docker exec -it bookax-postgres psql -U bookax_user -d bookax
