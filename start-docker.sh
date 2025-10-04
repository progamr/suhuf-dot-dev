#!/bin/bash

echo "🚀 Starting Suhuf in Docker..."
echo ""
echo "This will:"
echo "  1. Build the Docker containers"
echo "  2. Start PostgreSQL database"
echo "  3. Start Next.js development server"
echo "  4. Run database migrations"
echo ""
echo "Please wait..."
echo ""

# Build and start containers
docker compose up --build

# Note: Press Ctrl+C to stop
