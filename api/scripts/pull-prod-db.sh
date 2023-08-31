#!/bin/bash

# Connection strings
prod_connection="postgresql://mealrecommenderprod_user:Hos6Cae3HVYxyPRQUwtB0oo5loI2NuME@dpg-cjghv1b37aks73cloe2g-a.ohio-postgres.render.com/mealrecommenderprod"
local_connection="postgresql://postgres@localhost/meal_recommender"

# Dump the production database to a file
dump_file="production_dump.sql"
pg_dump "$prod_connection" --file="$dump_file"

# Restore the dump to the local database
psql "$local_connection" --file="$dump_file"

# Remove the dump file
rm "$dump_file"

echo "Database cloned from production to local."
