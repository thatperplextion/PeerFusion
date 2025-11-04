#!/bin/sh
set -e

host="${DB_HOST:-localhost}"
port="${DB_PORT:-5432}"
user="${DB_USER:-postgres}"

echo "Waiting for Postgres at ${host}:${port} as ${user}..."

until pg_isready -h "$host" -p "$port" -U "$user" > /dev/null 2>&1; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - continuing"

# Allow chaining commands
exec "$@"
