![CircleCI build status for master](https://circleci.com/gh/bwilczek/vfr-planner/tree/master.svg?style=shield)

# vfr-planner
Re-implementation VFR planning web application lecimy.org from ancient PHP to react/redux SPA with rails API as backend.

This is a very early stage of development - lots of prototyping going on and functionality is limited.

## Setting up development environment

```
# clone this repo
cd vfr-planner

# set secrets.js
# set up database

rails db:migrate
rails server --daemon -b 0.0.0.0

cd client
npm install
npm run dev

```

## Running it

```
# clone this repo
cd vfr-planner

# build the docker container
docker build -t vfr-planner .

# provide database that will be visible for container under name mysql (docker --link or --add-host)
# db_user: vfr, db_pass: vfr, db_name: vfr
# for example using docker:
docker run --rm --name vfr-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=vfr -e MYSQL_USER=vfr -e MYSQL_PASSWORD=vfr -p 3306:3306 mysql/mysql-server:5.6

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
  -e 'GEOCODE_API_KEY=XXXX' \
  -e 'RAILS_SERVE_STATIC_FILES=true' \
  vfr-planner
```

Application should be running at localhost:3000
