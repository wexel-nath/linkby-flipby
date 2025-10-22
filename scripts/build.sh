#!/bin/bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source "$SCRIPT_DIR/include/common.sh"

echo_section 'Building server image'
docker_compose build server

echo_section 'Building web-app image'
docker_compose build web-app
