#!/bin/bash

export NODE_ENV=production
cd client
./node_modules/.bin/webpack -p
# cp index.html and some CSS if necessary ?
cd ..
cp client/src/index.html public/index.html
cp client/src/sortable.css public/sortable.css
cp client/src/bootstrap.min.css public/bootstrap.min.css
rails s -b 0.0.0.0
