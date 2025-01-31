#!/bin/bash
set -e

# PostgreSQL をバックグラウンドで起動
echo "Starting PostgreSQL in the background..."
docker-entrypoint.sh postgres &

# PostgreSQL の起動を待機
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  sleep 1
done

echo "Executing create test database SQL..."
PGPASSWORD=$POSTGRES_PASSWORD psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /init/create-test-database.sql

echo "PostgreSQL is ready and SQL execution is complete."

# バックグラウンドで実行したものを待つ
wait -n
