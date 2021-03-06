#!/bin/bash

BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR=$BIN_DIR/..

if [ -z "$ONEDRIVE_DATA_URL" ]; then
  echo "ERROR: ENV variable ONEDRIVE_DATA_URL not set" >&2
  exit 1
fi

if [ -z "$SAVE_DIRECTORY" ]; then
  echo "ERROR: ENV variable SAVE_DIRECTORY not set" >&2
  exit 1
fi

docker run --rm \
  -u $(id -u $USER):$(id -g $USER) \
  -e HOME=/tmp \
  -v $SAVE_DIRECTORY:/download \
  onedrive $ONEDRIVE_DATA_URL root_files
