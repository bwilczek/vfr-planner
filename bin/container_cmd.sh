#!/bin/bash

# generate /app/clients/src/js/secrets.js basing on env variables

echo "export const FACEBOOK_APP_ID = '$FACEBOOK_APP_ID'" > /app/client/src/js/secrets.js
echo "export const GOOGLE_APP_ID = '$GOOGLE_APP_ID'" >> /app/client/src/js/secrets.js
echo "export const GOOGLE_MAPS_KEY = '$GOOGLE_MAPS_KEY'" >> /app/client/src/js/secrets.js
echo "export const GOOGLE_ANALYTICS_KEY = '$GOOGLE_ANALYTICS_KEY'" >> /app/client/src/js/secrets.js

cd /app/client && NODE_ENV=production ./node_modules/.bin/webpack -p

# wait for mysql to be up
while ! mysqladmin ping -h mysql --silent; do
  sleep 1
done

/app/bin/rails db:migrate
/app/bin/rails s -b 0.0.0.0
