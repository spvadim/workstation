#!/bin/bash

uri="mongodb://$DB_USER:$DB_PASSWORD@mongo:27017/$DB_NAME"
echo "Applying migrations"
exec /bin/bash -c "pymongo-migrate migrate -u $uri -m app/migrations"
