# createuser faker
# createdb faker -O faker

export PGUSER='faker'
export PGDATABASE='faker'

# psql -U spedata -d faker -f ./migration/create_db.sql

# node ./migration/seedDB.js

psql -U spedata -d faker -f ./migration/create_index.sql