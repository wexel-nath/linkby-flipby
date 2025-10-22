#!/bin/bash
set -e

INCLUDE_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source "$INCLUDE_DIR/format.sh"
source "$INCLUDE_DIR/docker_compose.sh"
