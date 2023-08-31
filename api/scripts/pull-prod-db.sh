#!/bin/bash

# Connection strings
prod_connection="postgresql://your-production-username:your-production-password@your-production-host:your-production-port/your-production-dbname"
local_connection="postgresql://postgres@localhost/meal_recommender"

# Dump the production database to a file
dump_file="production_dump.sql"
pg_dump "$prod_connection" --file="$dump_file"

# Restore the dump to the local database
psql "$local_connection" --file="$dump_file"

# Remove the dump file
rm "$dump_file"

echo "Database cloned from production to local."
