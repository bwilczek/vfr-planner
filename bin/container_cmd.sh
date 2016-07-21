#!/bin/bash

# wait for mysql to be up
while ! mysqladmin ping -h mysql --silent; do
  sleep 1
done

/app/bin/rails db:setup
/app/bin/rails db:migrate
/app/bin/rails s -b 0.0.0.0
