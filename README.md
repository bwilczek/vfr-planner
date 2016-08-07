# vfr-planner
Re-implementation VFR planning web application lecimy.org from ancient PHP to react/redux SPA with rails API as backend.

This is a very early stage of development - lots of prototyping going on, an functionality is limited.

## Running it

```
# clone this repo
cd vfr-planner

# build the docker container
docker build -t vfr-planner .

# provide database that will be visible for container under name mysql (docker --link or --add-host)
# db_user: vfr, db_pass: vfr, db_name: vfr

# then run the vfr-planner container providing your configuration
docker run -d \
  --name vfr-planner \
  --link mysql \
  -p 3000:3000 \
  -e 'RAILS_ENV=production' \
  -e 'SECRET_KEY_BASE=XXXX' \
  -e 'FACEBOOK_APP_ID=XXXX' \
  -e 'GOOGLE_APP_ID=XXXX.apps.googleusercontent.com' \
  -e 'GOOGLE_MAPS_KEY=XXXX' \
  -e 'RAILS_SERVE_STATIC_FILES=true' \
  vfr-planner
```

Application should be running at localhost:3000
