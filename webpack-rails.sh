#!/bin/bash

export NODE_ENV=production
cd client ; ./node_modules/.bin/webpack -p ; cd .. ; rails s -b 0.0.0.0
