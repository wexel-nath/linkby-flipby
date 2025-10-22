#!/bin/bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source "$SCRIPT_DIR/include/common.sh"

echo_section 'Applying DB migrations'
docker_compose run --rm db-migrate

echo_section 'Starting server'
docker_compose up -d server

echo_section 'Starting web-app'
docker_compose up -d web-app
