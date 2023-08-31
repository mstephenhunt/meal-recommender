#!/bin/bash

# Load environment variables from .env
export $(cat .env | xargs)

# Connection strings
prod_connection="${PROD_DATABASE_URL}"
local_connection="${DATABASE_URL}"

# Dump the production database to a file
dump_file="production_dump.sql"
# pg_dump "$prod_connection" --file="$dump_file"

# Drop all tables in the local database
psql "$local_connection" --command="DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# # Restore the dump to the local database
psql "$local_connection" --file="$dump_file"

# # Remove the dump file
# rm "$dump_file"

echo "Database cloned from production to local."
