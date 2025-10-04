#!/bin/sh
set -e

# Wait for the database to be ready using netcat instead of psql
echo "Waiting for PostgreSQL to be ready..."
until nc -z -w1 "$DB_HOST" 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - waiting a bit more to ensure it's fully ready"
sleep 3

echo "Running database migrations..."
# Run migrations automatically
npm run migration:up || echo "⚠️  Migrations failed or no migrations to run"

echo "✅ Database setup complete"
echo "💡 To seed the database, run: docker compose exec app npm run seed:run"

# Start the application
exec "$@"
